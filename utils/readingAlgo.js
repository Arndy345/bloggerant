const readingTime = (body) => {
	const noOfWords = body.split(" ").length;
	// assuming the average person reads 150 words a minute
	const wordsPerMinute = noOfWords / 150;
	return Math.round(wordsPerMinute) === 0
		? 1
		: Math.round(wordsPerMinute);
};

module.exports = readingTime;
