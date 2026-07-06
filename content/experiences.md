# Experiences

Copy for the interactive pieces. Questions and result text verbatim. Numbers are tokens.

## "Is your home at risk?" — the risk tool

**Intro:** Answer five quick questions. No sign-up, nothing saved. At the end you'll get a straight read on your home and one thing to do about it.

**Questions:**
1. Does your home burn any fuel — a gas or oil furnace, gas water heater, gas stove, fireplace, or wood stove? (Yes / No / Not sure)
2. Is there an attached garage? (Yes / No)
3. Do you have a carbon monoxide alarm? (Yes, and I've tested it recently / Yes, but I'm not sure it works / No / Not sure)
4. If you have alarms, how old are they? (Under 5 years / 5 or more years / I don't know / No alarms)
5. Has a professional checked your furnace or gas appliances in the last year? (Yes / No / Not sure / No such appliances)

**Result logic (plain):** If they burn fuel or have an attached garage AND lack a working, current alarm → **higher-risk** result. If they have fuel/garage but have a working current alarm and recent inspection → **protected** result. If all-electric, no garage, no fuel → **lower-risk** result. "Not sure" answers count toward higher risk.

**Result — higher risk:**
Your home has a way to make carbon monoxide and no reliable way to warn you about it. That's the exact combination behind most poisonings. The fix is small: put a working carbon monoxide alarm near every sleeping area, and get your fuel-burning appliances checked. Do the first part tonight.
→ Find an alarm and local help · Set a reminder to test it

**Result — protected:**
You've got the two things that matter: a working alarm and appliances someone actually checks. Keep it that way — test the alarm twice a year and replace it on schedule. Here's a reminder so you don't forget.
→ Set a twice-a-year reminder

**Result — lower risk:**
Your home doesn't burn fuel and has no attached garage, so your risk is low. It isn't zero — a shared wall or a borrowed generator can still bring carbon monoxide in — so a single alarm near the bedrooms is cheap insurance.
→ Learn where risk can still come from

**Reminder feature:** "Pick a day to test your alarm" → generates a calendar reminder (.ics). Wording: "Test the carbon monoxide alarm — The One Breath Project."

## "The invisible gas" — demonstration

**Copy:** Imagine your kitchen, exactly as it is right now. Now imagine it filling with a gas you can't see, can't smell, and can't taste — one that makes you sleepy before it makes you scared. You wouldn't get up. You wouldn't open a window. That's not a horror story; it's just how carbon monoxide works. The only thing in that room that would notice is an alarm. (No fabricated readings or fake countdowns — the point is the absence of any signal.)

## "The harm pyramid"

**Copy:** Deaths are the part we count. They sit on top of a much larger pile we mostly don't.
- Top: {{data:co_deaths|US|latest|CDC|Measured}} deaths a year.
- Below that: {{data:co_hospitalizations|US|latest|CDC|Measured}} hospitalized.
- Below that: {{data:co_er_visits|US|latest|CDC|Measured}} emergency-room visits.
- Below that, uncounted: people poisoned and sent home with the wrong diagnosis, and the near-misses an alarm caught in time.

**Closing:** The small number at the top is the reason people shrug. The size of the base is the reason they shouldn't. *(Hide any line whose token has no verified value.)*
