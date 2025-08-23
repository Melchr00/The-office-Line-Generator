/*** CSV utility file for fetching random Office lines ***/
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

/**
 * Load and parse the quotes dataset from CSV.
 * Trims fields to avoid whitespace issues from messy CSV data.
 */
const getCsvData = () => {
    const results = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(
            path.join(__dirname, '../data/the-office_lines.csv')
        )
            .pipe(csv())
            .on('data', (data) => {
                results.push({
                    character: (data.Character || '').trim(),
                    line: (data.Line || '').trim(),
                    season: parseInt(data.Season, 10),
                    episode: parseInt(data.Episode_Number, 10),
                });
            })
            .on('end', () => {
                if (!results.length) {
                    return reject(new Error('CSV file is empty.'))
                }
                resolve(results);
            })
            .on('error', reject)
    });
}

/**
 * Retrieves a single random entry from the CSV dataset.
 */
const getRandomEntry = async () => {
    const data = await getCsvData();
    const randomIndex = Math.floor(Math.random() * data.length);
    return data[randomIndex];
}

module.exports = {
    getRandomEntry,
    getCsvData,
};