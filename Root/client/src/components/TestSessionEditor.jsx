import { PDFDownloadLink } from "@react-pdf/renderer";
import TestTickets from "./TestTickets";
import ResultsPDF from "./ResultsPDF";
import Styles from "../styles/testSessionEditor.module.css";
import { useState, Fragment, useMemo } from "react";
import { calculateCronbachAlpha } from "../helpers/dataAnalysis";

export default function TestSessionEditor({
  testSession,
  close,
  allResults,
  testSessionResults,
  update,
  deleteSubject,
  editSubject,
  numberOfQuestions,
}) {
  const [subjectEditingId, setSubjectEditingId] = useState(-1);
  const [subjectsToIgnore, setSubjectsToIgnore] = useState([]);
  const [questionsToIgnore, setQuestionsToIgnore] = useState([]);

  let sessionMean = useMemo(() => {
    if (!testSessionResults) return;
    return (
      testSessionResults.subjects.reduce(
        (acc, s) =>
          acc +
          (subjectsToIgnore.includes(s.id)
            ? 0
            : s.rawScore -
              s.pointsPerQuestion.reduce(
                (accQ, pq, idx) =>
                  accQ + (questionsToIgnore.includes(idx) ? pq : 0),
                0
              )),
        0
      ) /
      (testSessionResults.subjects.length - subjectsToIgnore.length)
    );
  }, [testSessionResults, subjectsToIgnore, questionsToIgnore]);

  let sessionStandardDeviation = useMemo(() => {
    if (!testSessionResults) return;
    let mean = sessionMean;

    let variance =
      testSessionResults.subjects.reduce(
        (acc, s) =>
          acc +
          (subjectsToIgnore.includes(s.id)
            ? 0
            : (s.rawScore -
                s.pointsPerQuestion.reduce(
                  (accQ, pq, idx) =>
                    accQ + (questionsToIgnore.includes(idx) ? pq : 0),
                  0
                ) -
                mean) **
              2),
        0
      ) /
      (testSessionResults.subjects.length - 1 - subjectsToIgnore.length);

    let stdv = Math.sqrt(variance);
    return stdv;
  }, [testSessionResults, subjectsToIgnore, sessionMean, questionsToIgnore]);

  let sessionCronbach = useMemo(() => {
    if (!testSessionResults) return;
    return calculateCronbachAlpha(
      testSessionResults.subjects
        .filter((s) => !subjectsToIgnore.includes(s.id))
        .map((subject) =>
          subject.pointsPerQuestion.filter(
            (_, idx) => !questionsToIgnore.includes(idx)
          )
        ),
      numberOfQuestions - questionsToIgnore.length
    );
  }, [
    testSessionResults,
    numberOfQuestions,
    subjectsToIgnore,
    questionsToIgnore,
  ]);

  if (testSession) {
    const pdfFileName = `${testSession.location} ${testSession.startTime} test tickets.pdf`;
    return (
      <div className={Styles.outerContainer}>
        <div className={Styles.innerContainer}>
          <div className={Styles.topBar}>
            <div></div>
            <button
              onClick={() => {
                close();
                setSubjectEditingId(-1);
              }}
            >
              X
            </button>
          </div>
          <div className={Styles.header}>
            <h1>
              {testSession.location} on{" "}
              {new Date(testSession.startTime).toLocaleDateString()} at{" "}
              {new Date(testSession.startTime).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </h1>
          </div>

          <div className={Styles.downloads}>
            <PDFDownloadLink
              key={testSession.id + "a" + testSession.subjects.length}
              document={<TestTickets subjects={testSession.subjects} />}
              fileName={pdfFileName}
            >
              <button>Download Test Tickets PDF</button>
            </PDFDownloadLink>
            {testSessionResults && (
              <PDFDownloadLink
                document={
                  <ResultsPDF
                    results={allResults}
                    subjects={testSessionResults.subjects}
                    testSession={testSessionResults.testSession}
                    sessionResults={{
                      mean:
                        testSessionResults.subjects.reduce(
                          (acc, s) => acc + s.rawScore,
                          0
                        ) / testSessionResults.subjects.length,
                      standardDeviation: (() => {
                        let mean =
                          testSessionResults.subjects.reduce(
                            (acc, s) => acc + s.rawScore,
                            0
                          ) / testSessionResults.subjects.length;

                        let variance =
                          testSessionResults.subjects.reduce(
                            (acc, s) => acc + (s.rawScore - mean) ** 2,
                            0
                          ) /
                          (testSessionResults.subjects.length - 1);

                        let stdv = Math.sqrt(variance);
                        return stdv;
                      })(),
                    }}
                    allSubjects={(() => {
                      let allSubjects = [];
                      allResults.testSessions.forEach((ts) =>
                        allSubjects.push(...ts.subjects)
                      );
                      return allSubjects;
                    })()}
                  />
                }
                fileName={
                  testSession.location +
                  " " +
                  testSession.startTime +
                  " results.pdf"
                }
                key={testSession.id + "b" + testSession.subjects.length}
              >
                <button>Download Results PDF</button>
              </PDFDownloadLink>
            )}
          </div>
          <div className={Styles.addUser}>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                let response = await fetch(
                  import.meta.env.VITE_API_URL + "/api/subject/new",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      testingSessionId: testSession.id,
                      firstName: e.target.elements.firstname.value,
                      lastName: e.target.elements.lastname.value,
                      age: e.target.elements.age.value,
                    }),
                  }
                );
                let success = await response.text();
                if (success == "success") {
                  e.target.elements.firstname.value = "";
                  e.target.elements.lastname.value = "";
                  e.target.elements.age.value = "";
                }
                update();
              }}
            >
              <input type="text" id="firstname" />
              <input type="text" id="lastname" />
              <input
                type="number"
                id="age"
                placeholder="17"
                min="14"
                max="28"
              />
              <button>Add User</button>
            </form>
          </div>
          <div className={Styles.users}>
            <table className={Styles.statTable}>
              <tr>
                <th>User</th>
                {Array.from({ length: numberOfQuestions }, (_, idx) => (
                  <th
                    style={{
                      backgroundColor: questionsToIgnore.includes(idx)
                        ? "red"
                        : "transparent",
                    }}
                    key={idx}
                  >
                    {idx + 1}
                    <button
                      onClick={() => {
                        if (questionsToIgnore.includes(idx)) {
                          let newQuestionsToIgnore = questionsToIgnore;
                          newQuestionsToIgnore = newQuestionsToIgnore.filter(
                            (s) => s !== idx
                          );
                          setQuestionsToIgnore(newQuestionsToIgnore);
                          return;
                        }
                        setQuestionsToIgnore([...questionsToIgnore, idx]);
                      }}
                    >
                      Ignore
                    </button>
                  </th>
                ))}
              </tr>
              {testSession.subjects.map((subject) => (
                <Fragment key={subject.name + subject.id}>
                  {subjectEditingId == subject.id ? (
                    <tr>
                      <td>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            editSubject(
                              subject.id,
                              e.target.elements.name.value,
                              e.target.elements.age.value
                            );
                            setSubjectEditingId(-1);
                          }}
                        >
                          <button
                            className={Styles.deleteSubject}
                            onClick={() => {
                              if (confirm("Are you sure?")) {
                                deleteSubject(subject.id);
                              }
                            }}
                          >
                            X
                          </button>
                          <input id="name" defaultValue={subject.name}></input>{" "}
                          <input id="age" defaultValue={subject.age}></input>{" "}
                          <button type="submit">Submit</button>
                        </form>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      style={{
                        backgroundColor:
                          subjectsToIgnore.includes(subject.id) ||
                          !testSessionResults?.subjects.find(
                            (s) => s.id == subject.id
                          )
                            ? "red"
                            : "transparent",
                      }}
                    >
                      <td>
                        {subject.name} {subject.age}{" "}
                        <button onClick={() => setSubjectEditingId(subject.id)}>
                          Edit
                        </button>
                        {testSessionResults?.subjects.find(
                          (s) => s.id == subject.id
                        ) && (
                          <button
                            onClick={() => {
                              if (subjectsToIgnore.includes(subject.id)) {
                                let newSubjectsToIgnore = subjectsToIgnore;
                                newSubjectsToIgnore =
                                  newSubjectsToIgnore.filter(
                                    (s) => s !== subject.id
                                  );
                                setSubjectsToIgnore(newSubjectsToIgnore);
                                return;
                              }
                              setSubjectsToIgnore([
                                ...subjectsToIgnore,
                                subject.id,
                              ]);
                            }}
                          >
                            ignore
                          </button>
                        )}
                      </td>
                      {testSessionResults?.subjects
                        .find((s) => s.id == subject.id)
                        ?.pointsPerQuestion?.map((p, idx) => (
                          <td
                            style={{
                              backgroundColor: questionsToIgnore.includes(idx)
                                ? "red"
                                : "transparent",
                            }}
                          >
                            {p}
                          </td>
                        ))}
                      {testSessionResults?.subjects.find(
                        (s) => s.id == subject.id
                      ) && (
                        <td>
                          {testSessionResults?.subjects.find(
                            (s) => s.id == subject.id
                          )?.rawScore -
                            testSessionResults?.subjects
                              .find((s) => s.id == subject.id)
                              ?.pointsPerQuestion.reduce(
                                (accQ, pq, idx) =>
                                  accQ +
                                  (questionsToIgnore.includes(idx) ? pq : 0),
                                0
                              )}
                        </td>
                      )}
                    </tr>
                  )}
                </Fragment>
              ))}
            </table>
          </div>
          <div className={Styles.stats}>
            <h1>Stats</h1>
            <p>All Mean: {allResults?.mean}</p>
            <p>All Standard Deviation: {allResults?.standardDeviation}</p>
            <p>
              Session Mean: {sessionMean}{" "}
              {subjectsToIgnore.length > 0 && <>*</>}
            </p>
            <p>
              Session Standard Deviation: {sessionStandardDeviation}{" "}
              {subjectsToIgnore.length > 0 && <>*</>}
            </p>
            <p>
              Session Cronbach: {JSON.stringify(sessionCronbach)}{" "}
              {subjectsToIgnore.length > 0 && <>*</>}
            </p>
            <table></table>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
