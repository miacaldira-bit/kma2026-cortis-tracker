/* ===========================================
   SESSION 1 (FIXED)
=========================================== */

const session1 = {
    "ALPHA DRIVE ONE": 249408,
    "LNGSHOT": 94346,
    "CORTIS": 106474
};

/* ===========================================
   SESSION 2 (FIXED)
=========================================== */

const session2 = {
    "ALPHA DRIVE ONE": 401141,
    "LNGSHOT": 388690,
    "CORTIS": 99602
};

/* ===========================================
   LOAD LIVE DATA
=========================================== */

async function loadVotes() {

    let response;

    try {
        response = await fetch(
            "https://kma-proxy.miacaldira.workers.dev?t=" + Date.now()
        );

        if (!response.ok) {
            throw new Error("Worker unavailable");
        }

        console.log("Loaded from Cloudflare Worker");

    } catch (err) {

        console.warn("Worker failed, using local backup.");

        response = await fetch(
            "data.json?t=" + Date.now()
        );
    }

    const data = await response.json();

    /* ===========================
       Get Final Voting
    =========================== */

    const finalVoting = {};

    data.list.forEach(group => {
        finalVoting[group.name2] = group.total_vote_count;
    });

   /* ===========================
   Build All Groups
=========================== */

const allGroups = [];

data.list.forEach(group => {

    const name = group.name2;

    const s1 = session1[name] || 0;
    const s2 = session2[name] || 0;
    const live = group.total_vote_count;

    allGroups.push({

        name,

        session1: s1,

        session2: s2,

        final: live,

        total: s1 + s2 + live

    });

});

/* ===========================
   Rankings
=========================== */

const overall = [...allGroups].sort((a, b) => b.total - a.total);

const liveRanking = [...allGroups].sort((a, b) => b.final - a.final);

const cortis = overall.find(x => x.name === "CORTIS");

const overallRank =
    overall.findIndex(x => x.name === "CORTIS") + 1;

const liveRank =
    liveRanking.findIndex(x => x.name === "CORTIS") + 1;

const leader = overall[0];

    /* ===========================
       Dashboard
    =========================== */

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

    if (overallRank === 1) {

        const second = overall[1];
        const lead = cortis.total - second.total;

        document.getElementById("gap").textContent =
            lead.toLocaleString();

        document.getElementById("gapTitle").textContent =
            "Overall Lead";

        document.getElementById("gapGoal").textContent =
            lead.toLocaleString() + " votes";

        document.getElementById("status").textContent =
            "🟢 CORTIS is leading overall";

    } else {

        const gap = leader.total - cortis.total;

        document.getElementById("gap").textContent =
            gap.toLocaleString();

        document.getElementById("gapTitle").textContent =
            "Votes Needed";

        document.getElementById("gapGoal").textContent =
            gap.toLocaleString() + " votes";

        document.getElementById("status").textContent =
            "🔥 Catch " + leader.name;

    }
renderLeaderboard(allGroups, "overall");
    document.getElementById("updated").textContent =
        "Updated: " + new Date().toLocaleString();

}
/* ===========================================
   LEADERBOARD
=========================================== */

function renderLeaderboard(groups, filter) {

    const leaderboard = document.getElementById("leaderboard");

    leaderboard.innerHTML = "";

    const ranking = [...groups].sort((a, b) => {

        switch (filter) {

            case "final":
                return b.final - a.final;

            case "session1":
                return b.session1 - a.session1;

            case "session2":
                return b.session2 - a.session2;

            default:
                return b.total - a.total;

        }

    });

    ranking.forEach((group, index) => {

        let votes = group.total;

        if (filter === "final")
            votes = group.final;

        if (filter === "session1")
            votes = group.session1;

        if (filter === "session2")
            votes = group.session2;

        let medal = index + 1;

        if (index === 0) medal = "🥇";
        if (index === 1) medal = "🥈";
        if (index === 2) medal = "🥉";

        leaderboard.innerHTML += `

        <div class="rank-item">

            <div class="rank-left">

                <div class="rank-number">
                    ${medal}
                </div>

                <div class="rank-name">
                    ${group.name}
                </div>

            </div>

            <div class="rank-votes">
                ${votes.toLocaleString()}
            </div>

        </div>

        `;

    });

}
/* ===========================================
   START
=========================================== */

loadVotes();

// Refresh every minute
setInterval(loadVotes, 60000);
