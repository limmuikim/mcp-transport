# Project Prompts Log

This document records all the prompts provided during the development of the SBS Transit & LTA DataMall Live Transit application.

---

### Prompt 1
> **Date / Time:** 2026-10-06 21:36:54  
> **Request:**
> ```
> Build me an app with screens that look like this. You can hotlink images from the HTML
> ```
> *(Attached design screenshot featuring Urban Mobility & Transit Engine design system and the SBS Transit / LTA DataMall Real-Time Bus Tracker)*

---

### Prompt 2
> **Date / Time:** 2026-10-06 21:48:24  
> **Request:**
> ```
> remove the typography from the app
> ```

---

### Prompt 3
> **Date / Time:** 2026-10-06 21:49:41  
> **Request:**
> ```
> remove the Urban Mobility & Transit Engine (Design System Board)
> ```

---

### Prompt 4
> **Date / Time:** 2026-10-06 21:51:10  
> **Request:**
> ```
> git push https://<GITHUB_PERSONAL_ACCESS_TOKEN>@github.com/limmuikim/mcp-transport.git
> ```

---

### Prompt 5
> **Date / Time:** 2026-10-06 22:09:40  
> **Request:**
> ```
> 1) Create a/api folder under the project main to store all the apis
> 2) create a/api/health.js to monitor if the apis are working
> 3) integrate the LTA bus information api endpoint
> GET https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=04121
> Header:  AccountKey 
> 
> # BusStopCode is the only required parameter.
> # Add &ServiceNo=7 to ask about one service only.
> # Refreshes every 20 seconds. JSON comes back by default.
> i will add the LTA_ACCOUNT_KEY in vercel environment variables later.
> ```

---

### Prompt 6
> **Date / Time:** 2026-10-06 22:35:56  
> **Request:**
> ```
> create a prompt.md containing all my prompts located at project main
> ```
