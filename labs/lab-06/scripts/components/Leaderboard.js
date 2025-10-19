const Leaderboard = (topScores) => (
    `<h2>Top Scores:</h2>
    <section>
        <ol>
            ${ListItems(topScores)}
        </ol>
    </section>`
)

export default Leaderboard;

const ListItems = (topScores) => {
    let li = ``;
    const scores = topScores.sort((a,b) => b.score - a.score);
    for (let row of scores) {
        li += `<li>${row.name}: ${row.score}</li>`
    }
    return li;
}