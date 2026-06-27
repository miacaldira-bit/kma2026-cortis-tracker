/* ============================================
   SESSION 1 (FIXED)
============================================ */

const session1 = {
    "ALPHA DRIVE ONE": 249408,
    "AHOF": 140022,
    "CORTIS": 106474,
    "LNGSHOT": 94346,
    "KickFlip": 66629,
    "hrtz.wav": 9915
};

/* ============================================
   SESSION 2 (FIXED)
============================================ */

const session2 = {
    "ALPHA DRIVE ONE": 401141,
    "LNGSHOT": 388690,
    "CORTIS": 99602,
    "KickFlip": 66629,
    "hrtz.wav": 9915,
    "AHOF": 0
};

/* ============================================
   FINAL VOTING (UPDATE EVERY 10 MINUTES)
============================================ */

const finalVoting = {
    "CORTIS": 782788,
    "LNGSHOT": 764941,
    "ALPHA DRIVE ONE": 538137,
    "AHOF": 8960,
    "KickFlip": 4044,
    "KEYVITUP": 2556,
    "YUHZ": 2203,
    "NEWBEAT": 2152,
    "MODYSSEY": 1455,
    "hrtz.wav": 6760
};

/* ============================================
   BUILD OVERALL TABLE
============================================ */

const overall = [];

const groups = new Set([
    ...Object.keys(session1),
    ...Object.keys(session2),
    ...Object.keys(finalVoting)
]);

groups.forEach(name => {

    const s1 = session1[name] || 0;
    const s2 = session2[name] || 0;
    const fv = finalVoting[name] || 0;

    overall.push({
        name: name,
        session1: s1,
        session2: s2,
        final: fv,
        total: s1 + s2 + fv
    });

});

/* ============================================
   SORT OVERALL
============================================ */

overall.sort((a, b) => b.total - a.total);

/* ============================================
   FINAL VOTING RANKING
============================================ */

const live = [...overall]
    .sort((a, b) => b.final - a.final);

/* ============================================
   FIND CORTIS
============================================ */

const cortis = overall.find(x => x.name === "CORTIS");

const overallRank =
    overall.findIndex(x => x.name === "CORTIS") + 1;

const liveRank =
    live.findIndex(x => x.name === "CORTIS") + 1;

const leader = overall[0];

/* ============================================
   UPDATE PAGE
============================================ */

document.getElementById("overallTotal").textContent =
    cortis.total.toLocaleString();

document.getElementById("overallRank").textContent =
    "#" + overallRank;

document.getElementById("liveRank").textContent =
    "#" + liveRank;

document.getElementById("session1").textContent =
    cortis.session1.toLocaleString();

document.getElementById("session2").textContent =
    cortis.session2.toLocaleString();

document.getElementById("final").textContent =
    cortis.final.toLocaleString();

document.getElementById("overallLeader").textContent =
    leader.name;

document.getElementById("leaderVotes").textContent =
    leader.total.toLocaleString();

/* ============================================
   GAP TO OVERALL #1
============================================ */

if (overallRank === 1) {

    const second = overall[1];

    const lead =
        cortis.total - second.total;

    document.getElementById("gapTitle").textContent =
        "🏆 OVERALL LEAD";

    document.getElementById("gap").textContent =
        lead.toLocaleString();

    document.getElementById("gapGoal").textContent =
        lead.toLocaleString() + " votes";

    document.getElementById("status").textContent =
        "🟢 CORTIS is leading overall!";

} else {

    const gap =
        leader.total - cortis.total;

    document.getElementById("gapTitle").textContent =
        "Votes Needed";

    document.getElementById("gap").textContent =
        gap.toLocaleString();

    document.getElementById("gapGoal").textContent =
        gap.toLocaleString() + " votes";

    document.getElementById("status").textContent =
        "🔥 Keep voting to catch " + leader.name;

}

/* ============================================
   LAST UPDATED
============================================ */

const now = new Date();

document.getElementById("updated").textContent =
    "Updated: " + now.toLocaleString();