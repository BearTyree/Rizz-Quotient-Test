import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const testTicketPdfStyles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    padding: 10,
    fontFamily: "Times-Roman",
  },
  section: {},
  grid: { flexDirection: "row", justifyContent: "space-around" },
});

export default function TestTickets({ subjects }) {
  return (
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
}
