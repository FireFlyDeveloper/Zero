const { spawn } = require("child_process");

function startProject() {
	const child = spawn("node", ["Zero.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code == 2) {
            console.log("Restarting Project...");
			startProject();
		}
	});
}

startProject();