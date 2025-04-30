npm login
git add .
git commit -m "chore: update version"
npm version patch
npm publish
git push origin main --tags