import { useState, useEffect } from "react";
import Styles from "../styles/signup.module.css";

export default function Signup() {
  const [testSessions, setTestSessions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getInitialSubmittedState = () => {
    if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
      const storedValue = localStorage.getItem("alreadySubmitted");
      return storedValue === "true";
    }
    return false;
  };

  const [alreadySubmitted, setAlreadySubmitted] = useState(
    getInitialSubmittedState
  );
  async function submit(testingSessionId, firstName, lastName, age) {
    setLoading(true);
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/subject/new",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testingSessionId, firstName, lastName, age }),
      }
    );
    let success = await response.text();
    if (success == "success") {
      setLoading(false);
      setAlreadySubmitted(true);
      localStorage.setItem("alreadySubmitted", "true");
      return;
    }
    alert("error : " + success.err);
  }

  useEffect(() => {
    async function getTestSessions() {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/testSessions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setTestSessions(await response.json());
    }

    getTestSessions();
  }, []);
  if (loading)
    return (
      <>
        <div className={Styles.container}>
          <div className={Styles.form}>Loading</div>
        </div>
      </>
    );
  if (alreadySubmitted)
    return (
      <>
        <div className={Styles.container}>
          <div className={Styles.form}>Thanks for signing up!</div>
        </div>
      </>
    );
  if (!alreadySubmitted)
    return (
      <>
        <div className={Styles.container}>
          <form
            className={Styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              submit(
                testSessions[e.target.elements.testSession.selectedIndex].id,
                e.target.elements.firstName.value,
                e.target.elements.lastName.value,
                e.target.elements.age.value
              );
            }}
          >
            <h1>Proctored Rizz Aptitude Test — Signup</h1>
            <div className={Styles.nameContainer}>
              <div className={Styles.name}>
                <b>YOUR NAME:</b>
                (Print)
              </div>
              <div className={Styles.firstName}>
                <input className={Styles.input} type="text" id="firstName" />
                First Name
              </div>
              <div className={Styles.lastName}>
                <input className={Styles.input} type="text" id="lastName" />{" "}
                Last Name
              </div>
            </div>
            <div className={Styles.secondContainer}>
              <div className={Styles.ageContainer}>
                <div className={Styles.age}>
                  <b>YOUR AGE:</b>
                  (Print)
                </div>
                <div className={Styles.ageInput}>
                  <input
                    className={Styles.input}
                    type="number"
                    id="age"
                    placeholder="17"
                    min="14"
                    max="28"
                  />
                </div>
              </div>
              <div className={Styles.sessionContainer}>
                <div className={Styles.session}>
                  <b>TEST SESSION:</b>
                  (Print)
                </div>
                <div className={Styles.sessionInput}>
                  <select
                    className={Styles.input}
                    name="testSession"
                    id="testSession"
                  >
                    {testSessions
                      ?.filter(
                        (test) =>
                          new Date(test.startTime).getTime() > Date.now()
                      )
                      .sort((a, b) => {
                        return (
                          new Date(a.startTime).getTime() -
                          new Date(b.startTime).getTime()
                        );
                      })
                      .map((test, index) => (
                        <option key={index} value={test.location + " "}>
                          {test.location} on{" "}
                          {new Date(test.startTime).toLocaleDateString()} at{" "}
                          {new Date(test.startTime).toLocaleTimeString([], {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
            </div>
            <div className={Styles.submitContainer}>
              <button className={Styles.submit} type="submit">
                SUBMIT
              </button>
            </div>
          </form>
        </div>
      </>
    );
}
