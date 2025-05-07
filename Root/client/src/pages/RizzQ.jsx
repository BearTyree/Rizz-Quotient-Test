import { useState, useEffect, useCallback, useRef, Fragment } from "react";
import SectionPrompt from "../components/SectionPrompt";
import Question from "../components/Question";
import Styles from "../styles/test.module.css";
import BellCurve from "../components/BellCurve";
import Timer from "../components/Timer";

function RizzQ() {
  const [error, setError] = useState(null);
  const [norming, setNorming] = useState(true);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([]);
  const [info, setInfo] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [page, setPage] = useState();
  const [token, setToken] = useState(false);
  const timerRef = useRef();

  const submitEarly = useCallback(async () => {
    setLoading(true);
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/answers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      }
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.text();

    if (result) {
      setLoading(false);
      setPage("results");
    }

    return result;
  }, [answers, token]);

  const submit = async () => {
    setLoading(true);
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/answers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(answers),
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.text();

    if (result) {
      setLoading(false);
      setPage("results");
    }

    return result;
  };

  const getQuestions = async (token) => {
    try {
      const response = await fetch(
        import.meta.env.VITE_API_URL + "/api/questions",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();

      return result;
    } catch (error) {
      return { error };
    }
  };

  const getInfo = async (token) => {
    try {
      const response = await fetch(import.meta.env.VITE_API_URL + "/api/info", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const result = await response.json();
      return result;
    } catch (error) {
      return { error };
    }
  };

  // useEffect(() => {
  //   if (page == "test") {
  //     timerRef.current.startTimer();
  //   }
  // }, [page]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_URL + "/api/norming",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        let json = await response.json();
        setNorming(json);
        if (json == true) {
          setLoading(false);
          return;
        }
        const data = await getQuestions();
        const infoData = await getInfo();
        setInfo(infoData);
        setQuestions(data);
        setLoading(false);
        setPage("test");
        let answerList = [];
        for (let section of data) {
          for (let i = 0; i < section.questions.length; i++) {
            answerList.push({ id: section.questions[i].id, selection: -1 });
          }
        }
        setAnswers(answerList);
      } catch (e) {
        setError(e);
      }
    })();
  }, []);

  async function login(username, password) {
    const response = await fetch(
      import.meta.env.VITE_API_URL + "/api/subject/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      }
    );
    let text;
    try {
      text = await response.text();
      if (text == "access denied") {
        alert("wrong username or password");
        return;
      }
      setToken(text);
      setLoading(true);
    } catch {
      alert("wrong username or password");
      return;
    }
    const data = await getQuestions(text);
    const infoData = await getInfo(text);
    setInfo(infoData);
    setQuestions(data);
    setLoading(false);
    setPage("test");
    let answerList = [];
    for (let section of data) {
      for (let i = 0; i < section.questions.length; i++) {
        answerList.push({ id: section.questions[i].id, selection: -1 });
      }
    }
    setAnswers(answerList);
    return;
  }

  if (loading && !error) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!token && norming)
    return (
      <>
        <div className={Styles.loginContainer}>
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
              <h1>Login</h1>
            </div>
            <div className={Styles.infoContainer}>
              <div className={Styles.info}>
                <b>TEST TICKET:</b>
                (Print)
              </div>
              <div className={Styles.username}>
                <input
                  className={Styles.input}
                  id="username"
                  type="text"
                ></input>
                Username
              </div>
              <div className={Styles.password}>
                <input
                  className={Styles.input}
                  id="password"
                  type="text"
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
      </>
    );
  switch (page) {
    case "results": {
      return (
        <>
          <div className={Styles.thanksContainer}>
            <div className={Styles.form}>
              Thanks for taking the rizz aptitude test! <br /> You will receive
              a certificate with your calculated Rizz Quotient soon.
            </div>
          </div>
        </>
      );
    }
    case "test": {
      return (
        <div id={Styles.container}>
          <Timer timeUp={submitEarly} ref={timerRef} />
          {questions.map((section, sectionIndex) => (
            <div
              className={Styles.sectionContainer}
              key={"section" + sectionIndex}
            >
              {sectionIndex == 0 && (
                <Fragment key={sectionIndex + "details"}>
                  <div className={Styles.details}>
                    {info.details.split("\n").map((line) => (
                      <Fragment key={line + "" + sectionIndex + "n"}>
                        {line}
                        <br />
                      </Fragment>
                    ))}
                  </div>
                  <div className={Styles.directions}>
                    <span
                      style={{
                        textDecoration: "underline",
                        marginRight: "15px",
                      }}
                    >
                      Directions:
                    </span>
                    {info.directions}
                  </div>
                </Fragment>
              )}
              {section.prompt && (
                <div className={Styles.questionsInSection}>
                  Questions{" "}
                  {questions
                    .slice(0, sectionIndex)
                    .reduce((acc, val) => acc + val.questions.length, 1)}
                  -
                  {questions
                    .slice(0, sectionIndex)
                    .reduce((acc, val) => acc + val.questions.length, 0) +
                    section.questions.length}
                </div>
              )}
              <SectionPrompt
                key={"prompt" + sectionIndex}
                prompt={section.prompt || null}
                style={{ marginLeft: 0 }}
              />
              <ol
                className={Styles.list}
                start={questions
                  .slice(0, sectionIndex)
                  .reduce((acc, val) => acc + val.questions.length, 1)}
              >
                {section.questions?.map((question, questionIndex) => (
                  <li
                    key={"question" + questionIndex + "section" + sectionIndex}
                  >
                    <Question
                      prompt={question.prompt}
                      options={question.options}
                      setAnswer={(index) => {
                        let newAnswers = [...answers];
                        newAnswers[
                          questions
                            .slice(0, sectionIndex)
                            .reduce(
                              (acc, val) => acc + val.questions.length,
                              0
                            ) + questionIndex
                        ].selection = index;
                        setAnswers(newAnswers);
                      }}
                      selected={
                        answers[
                          questions
                            .slice(0, sectionIndex)
                            .reduce(
                              (acc, val) => acc + val.questions.length,
                              0
                            ) + questionIndex
                        ].selection
                      }
                    />
                  </li>
                ))}
              </ol>
            </div>
          ))}
          <div className={Styles.sectionSubmit}>
            <div className={Styles.submitContainer}>
              <button className={Styles.submit} onClick={() => submit()}>
                Submit Test
              </button>
            </div>
          </div>
        </div>
      );
    }
    default: {
      return <>page name error</>;
    }
  }

  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const [questionNumber, setQuestionNumber] = useState(1);
  // const [answers, setAnswers] = useState([]);
  // const [page, setPage] = useState("test");
  // const [results, setResults] = useState([]);
  // let timerRef;

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const response = await fetch(
  //         import.meta.env.VITE_API_URL + "/api/questions",
  //         {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //         }
  //       );
  //       if (!response.ok) {
  //         setError("error");
  //         throw new Error("Network response was not ok");
  //       }
  //       const result = await response.json();
  //       console.log(result);
  //       setData(result);
  //     } catch (error) {
  //       setError(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   console.log(data);
  // }, [data]);

  // async function submitAnswer(index, newItem) {
  //   setAnswers((prevAnswers) => {
  //     const newAnswers = [...prevAnswers];

  //     if (index < newAnswers.length) {
  //       // Replace the item at the specified index.
  //       newAnswers[index] = newItem;
  //     } else {
  //       // Fill missing indices with blank objects.
  //       for (let i = newAnswers.length; i < index; i++) {
  //         newAnswers.push({});
  //       }
  //       // Insert newItem at the specified index.
  //       newAnswers.push(newItem);
  //     }

  //     return newAnswers;
  //   });
  //   if (questionNumber == data.length) {
  //     return;
  //   }
  //   setQuestionNumber((number) => number + 1);
  // }
  // async function submitEarly() {
  //   let response = await fetch(
  //     import.meta.env.VITE_API_URL || "" + "/api/answers",
  //     {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ answers: answers }),
  //     }
  //   );
  //   console.log(answers);
  //   setPage("inbetween");
  //   let json = await response.json();
  //   if (json.message == "norming") {
  //     setPage("thanks");
  //     return;
  //   }
  //   setResults(json);
  //   setPage("results");
  //   return;
  // }
  // useEffect(() => {
  //   async function submit() {
  //     if (answers.length == data.length && questionNumber == data.length) {
  //       let response = await fetch(
  //         import.meta.env.VITE_API_URL || "" + "/api/answers",
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ answers: answers }),
  //         }
  //       );
  //       console.log(answers);
  //       setPage("inbetween");
  //       let json = await response.json();
  //       if (json.message == "norming") {
  //         setPage("thanks");
  //         return;
  //       }
  //       setResults(json);
  //       setPage("results");
  //       return;
  //     }
  //   }
  //   submit();
  // }, [answers, data.length, questionNumber]);

  // useEffect(() => {
  //   if (timerState) {
  //     console.log(timerState);
  //     timerState.startTimer();
  //   }
  // }, [timerState]);

  // useEffect(() => {
  //   async function getResults() {
  //     let response = await fetch('http://localhost:8080/calculaterizz', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'applcation/json' },
  //       body,
  //     });
  //   }
  //   if (page == 'inbetween') {
  //   }
  // }, [page]);

  // function goBackQuestion() {
  //   if (questionNumber == 1) {
  //     return;
  //   }
  //   setQuestionNumber((number) => number - 1);
  // }

  // return (
  //   <div className="max-w-[96rem] onpass bg-white ">
  //     {/* <div className="bg-[#4A90E2] text-white p-4">
  //       <p className="font-bold text-lg">Complete the Rizz Quiz</p>
  //       <p className="text-sm">
  //         Answer Questions Truthfully, Passing is 115 RizzQ
  //       </p>
  //     </div>{" "}
  //     {page == "test" ? (
  //       <div className="text-black p-6">
  //         {loading && <p>Loading...</p>}
  //         {error && <p>Error: {error.message}</p>}
  //         {data.length > 0 ? (
  //           <>
  //             <Timer
  //               ref={(t) => {
  //                 if (t && !timerRef) {
  //                   t.startTimer();
  //                   timerRef = t;
  //                 }
  //               }}
  //               timeUp={() => {
  //                 submitEarly();
  //                 setPage("inbetween");
  //               }}
  //             />
  //             <div className="h-5"></div>
  //             <Question
  //               number={questionNumber}
  //               question={data[questionNumber - 1].prompt}
  //               options={data[questionNumber - 1].options}
  //               submitAnswer={submitAnswer}
  //               propanswer={
  //                 answers[questionNumber - 1]?.answer
  //                   ? answers[questionNumber - 1].answer
  //                   : undefined
  //               }
  //               goBackQuestion={goBackQuestion}
  //               final={questionNumber == data.length ? true : false}
  //               questionId={data[questionNumber - 1].id}
  //               key={questionNumber}
  //             />
  //           </>
  //         ) : (
  //           ""
  //         )}
  //       </div>
  //     ) : (
  //       <>
  //         {page == "inbetween" ? (
  //           <></>
  //         ) : (
  //           <>
  //             {page == "results" ? (
  //               <div className="text-black">
  //                 <div className="grid place-items-center">
  //                   Your RizzQ is
  //                   <span className="font-bold"> {results.rizzq}</span>
  //                 </div>
  //                 <BellCurve rizzq={results.rizzq} />
  //                 <div className="flex justify-end items-end w-full pb-3">
  //                   <button className="mr-3 rounded-md p-1 border-1 border-black">
  //                     Continue
  //                   </button>
  //                 </div>
  //               </div>
  //             ) : (
  //               <div className="text-black">Thank You For Your Responses</div>
  //             )}
  //           </>
  //         )}
  //       </>
  //     )} */}
  //   </div>
  // );
}

export default RizzQ;
