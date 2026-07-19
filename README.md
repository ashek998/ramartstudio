# RAM Art Studio Website

Static website for RAM Art Studio, ready for GitHub Pages.

## Local Preview

Run a small static server from this folder:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## GitHub Pages Setup

1. Push these files to a GitHub repository.
2. In GitHub, open the repository.
3. Go to Settings > Pages.
4. Under Build and deployment, choose Deploy from a branch.
5. Select the main branch and /root folder.
6. Save and wait for GitHub to publish the site.

## GoDaddy Domain Setup for ramartstudio.in

After GitHub Pages gives you the live GitHub Pages URL:

1. In the repository, add a file named `CNAME` containing:

```text
ramartstudio.in
```

2. In GoDaddy DNS, add or update these records:

```text
Type: A
Name: @
Value: 185.199.108.153

Type: A
Name: @
Value: 185.199.109.153

Type: A
Name: @
Value: 185.199.110.153

Type: A
Name: @
Value: 185.199.111.153

Type: CNAME
Name: www
Value: your-github-username.github.io
```

3. In GitHub Pages settings, enter `ramartstudio.in` as the custom domain.
4. Enable Enforce HTTPS after DNS verification completes.

DNS can take a few minutes to 24 hours to fully update.

## Notes

- Instagram is linked to the official profile: `https://www.instagram.com/vishwas.bj/`.
- The Google Maps link is included as provided: `https://maps.app.goo.gl/Qhq5CsPMmKsJjMHf7`.
- Optional site audio is wired to `assets/site-audio.mp3` at 60% volume. Add only a rights-cleared audio file there before deployment. Browsers may block autoplay until the first user interaction.
