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

export default function ResultsPDF({
  subjects,
  results,
  testSession,
  sessionResults,
  allSubjects,
}) {
  return (
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
              Each question has answers that give a full point, partial points,
              a full negative point, or partial negative points.
            </Text>
            <Text
              style={{
                fontSize: "11px",
              }}
            >
              Your scaled score is your score scaled to the population. A scaled
              score of 10 is the mean score. Every point above or below 10 is a
              third of a standard deviation above or below the mean. For
              example, a scaled score of 13 would be one standard deviation
              above average. Meanwhile, a scaled score of 4 would be two
              standard deviations below average.
            </Text>
            <Text
              style={{
                fontSize: "11px",
              }}
            >
              Your Rizz Quotient is your "rizz number." Your Rizz Quotient is
              calculated on a standard rizz scale, with the mean being 100 and
              every 15 points being one standard deviation. Thus, a Rizz
              Quotient of 115 would be one standard deviation above average.
              Meanwhile, a Rizz Quotient of 95 would be a third of a standard
              deviation below average.
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
              Your Empirical Percentile is the percentage of a population that
              you scored higher than based on your actual rank within said
              population.
            </Text>
          </View>
          <View style={{ width: "50%" }}>
            <Text style={{ marginLeft: "20px" }}>
              Link your results to a rizzquotient.com (also huzzfeed.net)
              account with your linking code.
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
}
