# MetaCraft

## Summary

A non-commercial multiplayer RTS browser game built with phaser.

## Goals and TODO

The overall goal is to get one simple RTS unit working locally, then to get it working multiplayer.

- [ ] Make a single unit that you can left click select and right click move
- [ ] Give units health and attack
- [ ] Add multiplayer support

Once we have these absolute basics working, we'll come up with a new list of TODOs!

## Run the game locally

1. `cd phaser`
2. Install dependencies with `npm install`.
3. Start the development server with `npm run dev`.
4. Click on the URL in the terminal output (something like http://localhost:5173/)

## Get your change onto the public webpage

1. Run `npm run build`. This will populate the `/dist` folder with your changes and update all of the imports and filepaths to work correctly on the public website
2. Commit and push your code change. You may need to fork the repo, make a new branch, and create a pull request from MetaCraftFork->mybranch to MetaCraft->main.
3. Get your pull request merged.
4. See [deployments](https://github.com/aidan-waite/MetaCraft/deployments/github-pages). Every push to main should trigger a deployment which updates the webpage with the newest code.
5. Visit `https://aidan-waite.github.io/MetaCraft/phaser/dist/index.html` and see your change!
