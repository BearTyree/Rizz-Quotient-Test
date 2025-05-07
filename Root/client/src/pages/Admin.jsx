import { useState, Fragment } from "react";
import Styles from "../styles/admin.module.css";
import { Table, TR, TH, TD } from "@ag-media/react-pdf-table";
import {
  Page,
  Text,
  View,
  Font,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";

// Create styles
const testTicketPdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 10,
    fontFamily: "Times-Roman",
  },
  section: {},
  grid: { flexDirection: "row", justifyContent: "space-around" },
});

// Font.register({ family: "Roboto", src: source });

// Create Document Component
const TestTickets = ({ subjects }) => (
  <Document>
    {subjects.map((subject) => (
      <Page
        key={subject.testingUsername}
        size="A4"
        style={testTicketPdfStyles.page}
      >
        <View style={testTicketPdfStyles.section}>
          <Text>{subject.name} Test Ticket</Text>
          <View style={testTicketPdfStyles.grid}>
            <View>
              <Text>Username</Text>
              <Text>{subject.testingUsername}</Text>
            </View>
            <View>
              <Text>Password</Text>
              <Text>{subject.testingPassword}</Text>
            </View>
          </View>
        </View>
      </Page>
    ))}
  </Document>
);

const resultsPdfStyles = StyleSheet.create({
  page: {
    padding: 10,
    fontFamily: "Times-Roman",
    // backgroundColor: "white",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    // gap: 10,
  },
  bold: {
    fontWeight: "bold",
  },
  section: {
    fontFamily: "Times-Roman",
    width: "45%",
    // flex: "1 1 calc(50% - 20px)",
    // flexBasis: "auto",
    // padding: 10,
    // boxSizing: "border-box",
  },
  fullSection: {
    fontFamily: "Times-Roman",
    width: "100%",
  },
  title: {
    border: "1px solid black",
    flexBasis: "50%",
    padding: 10,
    boxSizing: "border-box",
    textAlign: "center",
  },
});

function normalcdf(mean, sigma, to) {
  var z = (to - mean) / Math.sqrt(2 * sigma * sigma);
  var t = 1 / (1 + 0.3275911 * Math.abs(z));
  var a1 = 0.254829592;
  var a2 = -0.284496736;
  var a3 = 1.421413741;
  var a4 = -1.453152027;
  var a5 = 1.061405429;
  var erf =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-z * z);
  var sign = 1;
  if (z < 0) {
    sign = -1;
  }
  return (1 / 2) * (1 + sign * erf);
}

const TestingResults = ({
  subjects,
  results,
  testSession,
  sessionResults,
  allSubjects,
}) => (
  <Document>
    {subjects.map((subject) => (
      <Page
        size="A4"
        style={resultsPdfStyles.page}
        key={subject.testingUsername + "score"}
      >
        {/* <View style={resultsPdfStyles.section}>
          <Text>{subject.name}</Text>
          <view>
            <Text>{testSession.location}</Text>
            <Text>{new Date(testSession.startTime).toLocaleDateString()}</Text>
          </view>
        </View>
        <View style={resultsPdfStyles.title}>
          <Text>RIZZ APTITUDE TEST SUMMARY RESULTS</Text>
        </View>
        <View style={resultsPdfStyles.section}>
          <view style={resultsPdfStyles.bold}>
            <Text>Results</Text>
          </view>
          <Text>Raw Score: {subject.rawScore}</Text>
          <Text>
            RizzQuotient:{" "}
            {Math.floor(
              100 +
                ((subject.rawScore - results.mean) /
                  results.standardDeviation) *
                  15
            )}
          </Text>
        </View> */}
        {/* <View
          style={[
            resultsPdfStyles.section,
            { borderBottom: "1px solid black" },
          ]}
        >
          <Text>{subject.name}</Text>
          <Text>{testSession.location}</Text>
          <Text>{new Date(testSession.startTime).toLocaleDateString()}</Text>
        </View> */}
        <View
          style={{
            width: "100%",
            margin: "20px",
            justifyContent: "center",
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          <View>
            <Text>RIZZ APTITUDE TEST</Text>
          </View>
          <View>
            <Text>SUMMARY RESULTS</Text>
          </View>
        </View>
        <View style={resultsPdfStyles.section}>
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Results
          </Text>
          <Table
            style={{
              borderStyle: "none",
            }}
          >
            <TR>
              <TD>Raw Score</TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.round(subject.rawScore * 100) / 100}
              </TD>
            </TR>
            <TR>
              <TD>Scaled Score</TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {10 +
                  Math.floor(
                    ((subject.rawScore - results.mean) /
                      results.standardDeviation) *
                      3
                  )}
              </TD>
            </TR>
            <TR>
              <TD>Rizz Quotient</TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.floor(
                  100 +
                    ((subject.rawScore - results.mean) /
                      results.standardDeviation) *
                      15
                )}
              </TD>
            </TR>
          </Table>
        </View>
        <View style={{ width: "40px" }}></View>
        <View style={resultsPdfStyles.section}>
          <Table
            style={{
              border: "0px",
            }}
          >
            <TR>
              <TD>Name</TD>
              <TD>{subject.name}</TD>
            </TR>
            <TR>
              <TD>Location</TD>
              <TD>{testSession.location}</TD>
            </TR>
            <TR>
              <TD>Date</TD>
              <TD>{new Date(testSession.startTime).toLocaleDateString()}</TD>
            </TR>
            <TR>
              <TD>Age</TD>
              <TD>{subject.age}</TD>
            </TR>
          </Table>
        </View>
        <View
          style={{
            width: "100%",
            height: "20px",
          }}
        ></View>
        <View style={resultsPdfStyles.fullSection}>
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Percentiles
          </Text>
          <Table
            style={{
              borderStyle: "none",
            }}
          >
            <TH>
              <TD></TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "20px",
                }}
              >
                Compared To All Test Takers
              </TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                  fontSize: "20px",
                }}
              >
                Compared To Same Session Test Takers
              </TD>
            </TH>
            <TR>
              <TD>Parametric percentile</TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.round(
                  normalcdf(
                    results.mean,
                    results.standardDeviation,
                    subject.rawScore
                  ) * 100
                ) < 99
                  ? Math.round(
                      normalcdf(
                        results.mean,
                        results.standardDeviation,
                        subject.rawScore
                      ) * 100
                    )
                  : Math.round(
                      normalcdf(
                        results.mean,
                        results.standardDeviation,
                        subject.rawScore
                      ) * 10000
                    ) / 100}
              </TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.round(
                  normalcdf(
                    sessionResults.mean,
                    sessionResults.standardDeviation,
                    subject.rawScore
                  ) * 100
                ) < 99
                  ? Math.round(
                      normalcdf(
                        sessionResults.mean,
                        sessionResults.standardDeviation,
                        subject.rawScore
                      ) * 100
                    )
                  : Math.round(
                      normalcdf(
                        sessionResults.mean,
                        sessionResults.standardDeviation,
                        subject.rawScore
                      ) * 1000000
                    ) / 10000}
              </TD>
            </TR>
            <TR>
              <TD>Empirical percentile (percentile rank)</TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.round(
                  100 *
                    (allSubjects.filter((s) => s.rawScore < subject.rawScore)
                      .length /
                      (subjects.length - 1))
                )}
              </TD>
              <TD
                style={{
                  justifyContent: "center",
                  textAlign: "center",
                }}
              >
                {Math.round(
                  100 *
                    (subjects.filter((s) => s.rawScore < subject.rawScore)
                      .length /
                      (subjects.length - 1))
                )}
              </TD>
            </TR>
          </Table>
        </View>
        <View
          style={{
            width: "100%",
            height: "20px",
          }}
        ></View>
        <View
          style={{
            width: "50%",
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
            }}
          >
            Understanding Your Score
          </Text>
          <Text
            style={{
              fontSize: "11px",
            }}
          >
            Your raw score is the total number of points you got on the test.
            Each question has answers that give a full point, partial points, a
            full negative point, or partial negative points.
          </Text>
          <Text
            style={{
              fontSize: "11px",
            }}
          >
            Your scaled score is your score scaled to the population. A scaled
            score of 10 is the mean score. Every point above or below 10 is a
            third of a standard deviation above or below the mean. For example,
            a scaled score of 13 would be one standard deviation above average.
            Meanwhile, a scaled score of 4 would be two standard deviations
            below average.
          </Text>
          <Text
            style={{
              fontSize: "11px",
            }}
          >
            Your Rizz Quotient is your "rizz number." Your Rizz Quotient is
            calculated on a standard rizz scale, with the mean being 100 and
            every 15 points being one standard deviation. Thus, a Rizz Quotient
            of 115 would be one standard deviation above average. Meanwhile, a
            Rizz Quotient of 95 would be a third of a standard deviation below
            average.
          </Text>
          <Text
            style={{
              fontSize: "11px",
            }}
          >
            Your Parametric Percentile is the percentage of a population that
            you scored higher than based on the Rizz Quotient normal curve.
          </Text>
          <Text
            style={{
              fontSize: "11px",
            }}
          >
            Your Empirical Percentile is the percentage of a population that you
            scored higher than based on your actual rank within said population.
          </Text>
        </View>
        <View style={{ width: "50%" }}>
          <Text style={{ marginLeft: "20px" }}>
            Link your results to a rizzquotient.com (also huzzfeed.net) account
            with your linking code.
          </Text>
          <View style={{ width: "100%", height: "5px" }}></View>
          <Text style={{ marginLeft: "20px" }}>
            Linking Code: {subject.linkingCode}
          </Text>
          <View style={{ marginLeft: "50%", width: "50%" }}>
            <Image src="/qrcode.png" />
          </View>
        </View>
        <View
          style={{ width: "100%", paddingLeft: "20px", paddingRight: "20px" }}
        >
          <Image src="/rizzcurve.png" />
        </View>
      </Page>
    ))}
  </Document>
);

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [token, setToken] = useState();
  const [testSessions, setTestSessions] = useState([]);
  const [results, setResults] = useState();

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
          <PDFDownloadLink
            key={
              session.testSession.location +
              session.testSession.startTime +
              index
            }
            document={<TestTickets subjects={session.subjects} />}
            fileName={
              session.testSession.location +
              " " +
              session.testSession.startTime +
              " test tickets.pdf"
            }
          >
            <button>
              Download {session.testSession.location}{" "}
              {session.testSession.startTime} PDF
            </button>
          </PDFDownloadLink>
        ))}
        <button onClick={() => getResults()}>Calc Results</button>
        {results?.testSessions?.map((testSession, index) => (
          <PDFDownloadLink
            document={
              <TestingResults
                results={results}
                subjects={testSession.subjects}
                testSession={testSession.testSession}
                sessionResults={{
                  mean:
                    testSession.subjects.reduce(
                      (acc, s) => acc + s.rawScore,
                      0
                    ) / testSession.subjects.length,
                  standardDeviation: (() => {
                    let mean =
                      testSession.subjects.reduce(
                        (acc, s) => acc + s.rawScore,
                        0
                      ) / testSession.subjects.length;

                    let variance =
                      testSession.subjects.reduce(
                        (acc, s) => acc + (s.rawScore - mean) ** 2,
                        0
                      ) /
                      (testSession.subjects.length - 1);

                    let stdv = Math.sqrt(variance);
                    return stdv;
                  })(),
                }}
                allSubjects={(() => {
                  let allSubjects = [];
                  results.testSessions.forEach((ts) =>
                    allSubjects.push(...ts.subjects)
                  );
                  return allSubjects;
                })()}
              />
            }
            fileName={
              testSession.testSession.location +
              " " +
              testSession.testSession.startTime +
              " results.pdf"
            }
            key={index}
          >
            <button>
              Download {testSession.testSession.location}{" "}
              {testSession.testSession.startTime} PDF
            </button>
          </PDFDownloadLink>
        ))}
      </>
    );
}
