function calculateVariance(data) {
	const n = data.length;
	if (n < 2) return 0;
	const mean = data.reduce((sum, value) => sum + value, 0) / n;
	const variance =
		data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / (n - 1);
	return variance;
}

function cronbachAlpha(dataset) {
	const numRespondents = dataset.length;
	if (numRespondents === 0) return null;

	const numItems = dataset[0].length;
	if (numItems < 2) return null; // Cronbach's alpha requires at least 2 items

	// Calculate variance for each item (column-wise)
	const itemVariances = [];
	for (let j = 0; j < numItems; j++) {
		const itemScores = dataset.map((row) => row[j]);
		itemVariances.push(calculateVariance(itemScores));
	}

	// Sum of the item variances
	const sumItemVariances = itemVariances.reduce((sum, v) => sum + v, 0);

	// Calculate total score for each respondent (sum of items in a row)
	const totalScores = dataset.map((row) =>
		row.reduce((sum, value) => sum + value, 0)
	);

	// Calculate variance of the total scores
	const totalVariance = calculateVariance(totalScores);

	// Cronbach's alpha formula:
	// alpha = (k/(k-1)) * (1 - (sum(item variances) / totalVariance))
	const alpha =
		(numItems / (numItems - 1)) * (1 - sumItemVariances / totalVariance);

	return alpha;
}

// Example usage:
// Assume you have a survey with 4 items and 5 respondents.
// The scores are based on your scale: best = 1, second best = 0.5, second worst = -0.5, worst = -1.
const surveyData = [
	[0.5, 0.5, 0.5, 0.5],
	[1, 0.5, 1, 1],
	[-1, -1, -0.5, 1],
	[-1, -1, -0.5, -1],
	[1, 1, 0.5, 0.5],
];

const alphaValue = cronbachAlpha(surveyData);
console.log("Cronbach's Alpha:", alphaValue);
