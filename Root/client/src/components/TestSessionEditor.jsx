import { PDFDownloadLink } from "@react-pdf/renderer";
import TestTickets from "./TestTickets";
import ResultsPDF from "./ResultsPDF";
import Styles from "../styles/testSessionEditor.module.css";

export default function TestSessionEditor({
  testSession,
  close,
  allResults,
  testSessionResults,
  update,
  deleteUser,
}) {
  if (testSession) {
    const pdfFileName = `${testSession.location} ${testSession.startTime} test tickets.pdf`;
    return (
      <div className={Styles.outerContainer}>
        <div className={Styles.innerContainer}>
          <div className={Styles.topBar}>
            <div></div>
            <button onClick={() => close()}>X</button>
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
            <ul>
              {testSession.subjects.map((subject) => (
                <li>
                  {subject.name} {subject.age}{" "}
                  <button
                    onClick={() => {
                      deleteUser(subject.id);
                    }}
                  >
                    X
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  } else {
    return <></>;
  }
}
