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

        if (!response.ok) throw new Error("Worker failed");
    } catch (e) {
        console.log("Using local backup data.json");
        response = await fetch("data.json?t=" + Date.now());
    }

    const data = await response.json();

    // rest of your code...
}

   

    // Get live final voting
    const finalVoting = {};

    data.list.forEach(group => {
        finalVoting[group.name2] = group.total_vote_count;
    });

    // Build overall table
    const overall = [];

    ["CORTIS", "LNGSHOT", "ALPHA DRIVE ONE"].forEach(name => {

        const s1 = session1[name];
        const s2 = session2[name];
        const live = finalVoting[name];

        overall.push({
            name,
            session1: s1,
            session2: s2,
            final: live,
            total: s1 + s2 + live
        });

    });

    // Sort Overall
    overall.sort((a, b) => b.total - a.total);

    // Sort Live
    const liveRanking = [...overall].sort((a, b) => b.final - a.final);

    const cortis = overall.find(x => x.name === "CORTIS");

    const overallRank =
        overall.findIndex(x => x.name === "CORTIS") + 1;

    const liveRank =
        liveRanking.findIndex(x => x.name === "CORTIS") + 1;

    const leader = overall[0];

    // Update Dashboard

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

    document.getElementById("updated").textContent =
        "Updated: " + new Date().toLocaleString();

}

/* ===========================================
   START
=========================================== */

loadVotes();

// Refresh dashboard every minute so it picks up
// the new data.json after GitHub updates it.

setInterval(loadVotes, 60000);
