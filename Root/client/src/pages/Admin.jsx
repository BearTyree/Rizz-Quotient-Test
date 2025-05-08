import { useState, Fragment } from "react";
import Styles from "../styles/admin.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ResultsPDF from "../components/ResultsPDF";
import TestTickets from "../components/TestTickets";
import TestSessionEditor from "../components/TestSessionEditor";

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState();
  const [testSessions, setTestSessions] = useState([]);
  const [results, setResults] = useState();
  const [sessionEditorIndex, setSessionEditorIndex] = useState(-1);

  async function login(username, password) {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      }
    );

    if (response.ok) {
      setAuthenticated(true);
      setToken(await response.text());
    }
  }
  async function getTestSessions() {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/testSessions",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setTestSessions(await response.json());
  }
  async function getResults() {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/compileResults",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setResults(await response.json());
  }

  async function deleteUser(id) {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/deleteSubject",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      }
    );
    let success = await response.text();
    if (success == "success") {
      getTestSessions();
    }
  }

  const newTest = async (name) => {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/new/test",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      }
    );
    console.log(await response.text());
  };
  const newTestSession = async (
    location,
    startTime,
    endTime,
    testName,
    includeInResults
  ) => {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/admin/new/testSession",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          location,
          startTime,
          endTime,
          testName,
          includeInResults,
        }),
      }
    );
    console.log(await response.text());
  };
  if (!authenticated)
    return (
      <div className={Styles.container}>
        <form
          className={Styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            login(
              e.target.elements.username.value,
              e.target.elements.password.value
            );
          }}
        >
          <div style={{ textAlign: "center" }}>
            <h1>Admin Login</h1>
          </div>
          <div className={Styles.infoContainer}>
            <div className={Styles.info}>
              <b>ADMIN INFO:</b>
              (Print)
            </div>
            <div className={Styles.username}>
              <input className={Styles.input} id="username" type="text"></input>
              Username
            </div>
            <div className={Styles.password}>
              <input
                className={Styles.input}
                id="password"
                type="password"
              ></input>
              Password
            </div>
          </div>
          <div className={Styles.submitContainer}>
            <button className={Styles.submit} type="submit">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  if (authenticated)
    return (
      <>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            newTest(e.target.elements.fname.value);
          }}
        >
          <label htmlFor="fname">Test Name:</label>
          <input type="text" id="fname" name="fname" />
          <button type="submit">Create</button>
        </form>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            newTestSession(
              e.target.elements.location.value,
              e.target.elements.start.value,
              e.target.elements.end.value,
              e.target.elements.test.value,
              e.target.elements.include.value
            );
            e.target.elements.location.value = "";
            e.target.elements.start.value = "";
            e.target.elements.end.value = "";
            e.target.elements.test.value = "";
            e.target.elements.include.value = "";
          }}
        >
          <label htmlFor="location">Location:</label>
          <input type="text" id="location" name="location" />
          <label htmlFor="start">Start:</label>
          <input type="datetime-local" id="start" name="start" />
          <label htmlFor="end">End:</label>
          <input type="datetime-local" id="end" name="end" />
          <label htmlFor="test">Test:</label>
          <input type="text" id="test" name="test" />
          <label htmlFor="include">Include In Results:</label>
          <input type="checkbox" id="include" name="include" />
          <button type="submit">Create</button>
        </form>
        <button onClick={() => getTestSessions()}>Get Test Sessions</button>
        {testSessions?.map((session, index) => (
          <Fragment key={index}>
            <button
              onClick={() => {
                setSessionEditorIndex(index);
                getResults();
              }}
            >
              Edit {session.location} on{" "}
              {new Date(session.startTime).toLocaleDateString()} at{" "}
              {new Date(session.startTime).toLocaleTimeString([], {
                hour: "numeric",
                minute: "2-digit",
              })}
            </button>
            {
              //   <PDFDownloadLink
              //   key={
              //     session.testSession.location +
              //     session.testSession.startTime +
              //     index
              //   }
              //   document={<TestTickets subjects={session.subjects} />}
              //   fileName={
              //     session.testSession.location +
              //     " " +
              //     session.testSession.startTime +
              //     " test tickets.pdf"
              //   }
              // >
              //   <button>
              //     Download {session.testSession.location}{" "}
              //     {session.testSession.startTime} PDF
              //   </button>
              // </PDFDownloadLink>
            }
          </Fragment>
        ))}
        <TestSessionEditor
          testSession={testSessions[sessionEditorIndex] || undefined}
          allResults={results || undefined}
          testSessionResults={
            results && testSessions[sessionEditorIndex]
              ? results.testSessions.find(
                  (s) => s.testSession.id == testSessions[sessionEditorIndex].id
                ) || undefined
              : undefined
          }
          close={() => setSessionEditorIndex(-1)}
          update={() => getTestSessions()}
          deleteUser={(id) => deleteUser(id)}
        />
      </>
    );
}
