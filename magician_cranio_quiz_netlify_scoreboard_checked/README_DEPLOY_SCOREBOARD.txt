MAGICIAN CRANIO QUIZ — NETLIFY SHARED SCOREBOARD SETUP

Important: If you upload this ZIP/folder using Netlify drag-and-drop/manual deploy, Netlify does NOT run the npm build/install step. The quiz page will work, but the shared leaderboard may NOT work because the serverless function and @netlify/blobs storage are not built/installed.

Best option for a functioning shared scoreboard:
1. Put this whole folder in a GitHub repository.
2. In Netlify, choose Add new site → Import an existing project.
3. Connect the GitHub repository.
4. Build command: npm run build
5. Publish directory: .
6. Functions directory: netlify/functions
7. Deploy.

Alternative with Netlify CLI:
1. Install Netlify CLI: npm install -g netlify-cli
2. Open Terminal in this folder.
3. Run: npm install
4. Run: netlify deploy --prod

How to check the scoreboard after deployment:
Open this URL in your browser, replacing YOUR-SITE with your Netlify site name:
https://YOUR-SITE.netlify.app/.netlify/functions/scoreboard

Expected result:
{"ok":true,"scores":[]}

If you see 404, the function did not deploy.
If you see 500, the function deployed but storage/dependency setup failed.
If you see the JSON above, the shared leaderboard is connected.
