---
summary: Create a free GitHub account, make a public repository, and publish a one-page case study of what you built on GitHub Pages. Your certificate links to it, so anyone can see your work.
quiz:
  - question: Which of these is safe to put on your portfolio page?
    options:
      - Your bot token, so people can try your assistant
      - A sample reply with the customer's name changed
      - A screenshot showing a client's email address
      - Your n8n password
    answer: 1
    explanation: Your repository is public, so anyone can read everything in it. Show real examples, but change names and remove every key, token, email address and phone number first.
  - question: You saved your page, but your GitHub Pages link shows "404". What should you do first?
    options:
      - Delete the repository and start again
      - Wait a few minutes, check Pages says your site is live, then check the file is called index.md
      - Make the repository private
      - Email GitHub
    answer: 1
    explanation: A new site can take a few minutes to go live. If it still shows 404, the page file must be called index.md, all in lower case, at the top of your repository.
  - question: Why does your portfolio need to be a public repository?
    options:
      - Private repositories cost more
      - So clients, employers and anyone checking your certificate can see your work
      - GitHub deletes private repositories
      - It doesn't matter
    answer: 1
    explanation: Your portfolio is proof of what you can do. It only works as proof if people can open it.
---

**Read time: 10 minutes · Build time: 45 minutes · Cost: free**

You've spent eight weeks building. Now you'll show it. In this lesson you'll publish a one-page case study about what you built, on a free website that stays online after the course.

You'll use **GitHub**, where people keep and share their work, and **GitHub Pages**, which turns a page in GitHub into a website. You don't need to write any code.

## What you'll have at the end

By the end of this lesson you'll have:

1. A free **GitHub account**.
2. A public **repository**, a folder on GitHub that holds your project.
3. A live **portfolio page** at an address like `https://your-name.github.io/ai-assistant-portfolio/`.

Your certificate will link to this page, so anyone who checks it sees your work.

## Before you start

- [ ] Your plan from last week's apply assignment: your problem, what you'll feature, your results and what you'll leave out.
- [ ] Two or three examples of your assistant's work, with names and numbers changed.
- [ ] Small business: your featured workflow, downloaded from n8n. Professionals: the requests, schedules and rules your assistant uses.
- [ ] An email address you check.

## Step 1: Create your GitHub account

1. Go to `github.com` and click **Sign up**.
2. Enter your email, a password and a username. Your username becomes part of your page's address, so choose something professional, like your name or your business name.
3. Check your email for the code GitHub sends you, and type it in.

> **You should now see:** your GitHub home page, with a green **New** or **Create repository** button.

> **Stay safe:** Turn on two-factor authentication under **Settings**, then **Password and authentication**. Your portfolio carries your name, so protect the account like your email.

## Step 2: Create your repository

1. Click the **+** at the top right, then **New repository**.
2. **Repository name:** type `ai-assistant-portfolio`
3. **Description:** one line, for example `How I built an AI team for my cake business`
4. Choose **Public**.
5. Turn on **Add README**.
6. Click **Create repository**.

> **You should now see:** your new repository, with a file called `README.md`.

## Step 3: Write your README

The README tells visitors what the repository holds.

1. Click `README.md`, then the **pencil** at the top right of the file.
2. Delete what's there, and write two or three lines about your project. For example:

```markdown
# My AI assistant portfolio

The AI team I built during the Hyrax AI Academy. See the case study at the link on the right, and my workflows in this repository.
```

3. Click **Commit changes**, then **Commit changes** again. On GitHub, "commit" means save.

## Step 4: Add your files

**Small business:** open your featured workflow file in a text editor first. Search it for your Telegram ID and any phone numbers, and replace each one with X's. Your keys and passwords aren't in the file, because n8n leaves them out.

**Professionals:** your setup goes in a new file.

1. Click **Add file**, then **Create new file**.
2. Name it `my-assistant.md`.
3. Paste in the requests you use, your scheduled jobs and their schedules, and the rules Hermes follows, like your triage rules and writing style. Replace names with roles.
4. Click **Commit changes**, then **Commit changes** again.

**Both tracks:** to add a workflow file or screenshots, click **Add file**, then **Upload files**. Drag your files in, and click **Commit changes**.

> **Stay safe:** Before you upload a screenshot, check it for names, email addresses, phone numbers and anything in your browser's tabs or address bar. Crop or blur anything private.

## Step 5: Write your portfolio page

Your page is a file called `index.md`. GitHub Pages turns it into a website.

1. Click **Add file**, then **Create new file**.
2. Name it `index.md`, all in lower case.
3. Copy the template below, paste it in, and replace everything in square brackets with your own words.

```markdown
# [Your project's name]

[One sentence: what you built, and who it's for.]

## The problem

[What took up your time, or what was being missed, before.]

## What I built

[Each assistant or job in one or two sentences.]

## How it works

[Your featured assistant, step by step, from what starts it to the result. Say where you approve before anything goes out.]

## Results

[At least two real examples, with names and numbers changed. To show a screenshot you uploaded, write: ![What it shows](your-file-name.png)]

## Keeping it safe

[How you protect customers' or clients' information, and how you'd stop your assistant.]

## What's next

[What you'd improve or build next.]
```

4. Click **Commit changes**, then **Commit changes** again.

## Step 6: Switch on GitHub Pages

1. In your repository, click **Settings** at the top.
2. In the menu on the left, click **Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
5. Wait two or three minutes, then refresh the page.

> **You should now see:** "Your site is live at" and your page's address, with a **Visit site** button. Click it to see your page.

> **If it didn't work:** If your page shows **404**, wait a few more minutes and refresh. If it still shows 404, check your page file is called exactly `index.md` and sits at the top of your repository, not inside a folder. If your screenshot doesn't show, check the file name in your page matches the uploaded file exactly, including capital letters.

## Step 7: Check it like a stranger

Open your page on your phone, as a client or employer would.

1. Does the first sentence say clearly what you built?
2. Could someone who has never heard of n8n or Hermes follow **How it works**?
3. Search the page for names, phone numbers, email addresses and anything that looks like a key or token. Remove anything you find.

To change your page, open `index.md` in your repository, click the **pencil**, edit it, and commit. Your site updates within a few minutes.

## Keep it safe

1. **Public means public.** Anyone can read everything in your repository, including old versions of files.
2. **Never upload a key or token.** If one slips in, deleting the file isn't enough. Make a new key or token straight away, in n8n, Meta, Telegram or Hermes, so the old one stops working.
3. **Change names and numbers** in every example and screenshot.

## Test it

Before you submit your portfolio project, check each of these:

- [ ] My repository is **Public** and has a README.
- [ ] My page opens from the **Visit site** link, on my computer and my phone.
- [ ] My page has all six parts: the problem, what I built, how it works, results, keeping it safe, and what's next.
- [ ] My repository has my workflow or `my-assistant.md`.
- [ ] I searched my page and files for names, phone numbers, email addresses, keys and tokens.

## Recap and what's next

You now have a public page that shows what you built, how it works and how you keep it safe. That's more convincing than any exam result.

Submit your page link and repository link on the portfolio project page before the week 9 deadline. Then keep your page up to date as you build more. It's yours to keep.
