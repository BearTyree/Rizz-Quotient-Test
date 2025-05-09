export function calculateCronbachAlpha(responses, numberOfQuestions) {
  console.log(numberOfQuestions);
  let variancesSum = 0;
  let totalMean =
    responses.reduce(
      (totalAcc, response) =>
        totalAcc + response.reduce((responseAcc, v) => responseAcc + v, 0),
      0
    ) / responses.length;
  console.log(totalMean);
  for (let i = 0; i < numberOfQuestions; i++) {
    let mean =
      responses.reduce((acc, r) => acc + (r[i] || 0), 0) / responses.length;
    variancesSum +=
      responses.reduce((acc, r) => acc + (mean - r[i]) ** 2, 0) /
      (responses.length - 1);
  }
  console.log(variancesSum);
  let totalVariance =
    responses.reduce(
      (totalAcc, response) =>
        totalAcc +
        (totalMean - response.reduce((responseAcc, v) => responseAcc + v, 0)) **
          2,
      0
    ) /
    (responses.length - 1);
  console.log(totalVariance);

  return (
    (numberOfQuestions / (numberOfQuestions - 1)) *
    ((totalVariance - variancesSum) / totalVariance)
  );
}
