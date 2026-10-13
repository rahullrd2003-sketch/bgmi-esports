BGMI E-SPORTS — Prototype v0.1
================================

Is prototype mein:
- Mobile-friendly tournament cards (Solo, Duo, Squad)
- Player profile form
- Demo registration
- My registrations section
- Browser localStorage save
- PWA manifest + service worker cache

IMPORTANT:
Yeh sirf front-end demo hai. Ismein real mobile OTP login, shared database, admin panel,
real room ID/password, live tournaments ya server-side registration nahi hai.
Data sirf usi browser/device mein save hota hai. Public tournament chalane se pehle
real authentication, secure database rules, admin permissions aur privacy notice jodein.
Kisi player ka OTP/password kabhi collect/store na karein.

FREE HOSTING (GitHub Pages):
1. GitHub account par login/create karein.
2. New public repository banayein, e.g. bgmi-esports.
3. Is ZIP ke andar ki files repository ke root mein upload karein.
4. Repository Settings > Pages kholein.
5. Build and deployment mein Deploy from a branch select karein.
6. Branch: main, folder: /(root), Save.
7. Pages ka published HTTPS link kholein. Publish hone mein kuch minute lag sakte hain.
8. Android Chrome mein link kholein > menu (⋮) > Add to Home screen / Install app.

Alternative: Firebase Hosting PWA ko HTTPS par host kar sakta hai. Real phone OTP ke liye
Firebase Authentication setup, authorized domain, Phone provider, SMS region policy,
reCAPTCHA aur quotas/billing details configure karna hoga. Free SMS usage unlimited nahi hai.

Local testing:
- ZIP extract karein.
- VS Code + Live Server extension se index.html ko serve karein, ya GitHub Pages par publish karein.
- file:// se kholne par install/offline functionality kaam na bhi kare.

Agla development step:
Firebase Phone OTP + Firestore database + admin-only rules.
