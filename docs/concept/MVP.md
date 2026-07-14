# Odday MVP — Planning & Validation Document

> Note: Odday is a Korean-facing product. Explanatory prose here is in English, but literal product content —
> quest text, on-screen UI copy, and taglines — is kept in Korean, since those are the actual strings shipped to users.

## 1. Project overview

**Odday** is a real-world quest service that nudges users into performing small actions they wouldn't normally do in everyday life.

The name combines `Odd + Day` — the idea of turning an ordinary day into one that's a little odd and a little more memorable.

### Brand message

> 오늘을 조금 이상하게.

### English tagline

> Make today a little odd.

Odday doesn't ask users for grand goals or self-improvement assignments.

Instead it proposes low-effort, slightly unfamiliar actions like these:

- 평소 가지 않던 길로 10분간 걸어보기
- 주변에서 가장 오래돼 보이는 물건 찾기
- 처음 보는 음료나 간식 선택하기
- 집 안에서 가장 정체를 알기 어려운 물건 찾기
- 오늘 가장 이상한 간판 사진 찍기
- 오랫동안 연락하지 않은 사람 한 명 떠올려보기

Odday's purpose is not simple to-do management or habit formation.

Its core purpose is:

> To create a small event in the user's repetitive daily routine, and to prompt an action they wouldn't otherwise have taken.

---

## 2. One-line service definition

> Odday proposes a small real-world quest for an ordinary day, making users act differently than they usually would.

Put a bit more emotionally:

> It creates one small event in a day that would otherwise pass by uneventfully.

---

## 3. Purpose of the MVP

The most important purpose of the Odday MVP is not to finish building the service.

The purpose is to validate whether the concept of a real-world quest can actually produce user behavior.

The core questions we want to validate are:

1. After visiting Odday, does the user check the quests?
2. Do they actually select one of the presented quests?
3. Do they perform the selected quest in real life?
4. Do they take an action they wouldn't have taken without Odday?
5. After doing one, do they request another quest?
6. Do they revisit Odday a few days later?
7. Do they share a quest or result with someone else?
8. Which type of quest gets the best response?

So the purpose of the Odday MVP is not to collect a large amount of anonymous data for its own sake.

Data collection is a means to judge the following hypothesis:

> Do users find Odday's quests interesting, act on them in reality, and feel they're worth using repeatedly?

---

## 4. Core product hypotheses

### Hypothesis 1. Users want to create change in their repetitive routine

Users may not want a full trip or special event, but they also don't want an ordinary day to pass completely meaninglessly.

Odday proposes a small action, creating change in daily life at low cost.

---

### Hypothesis 2. A concrete action proposal is more actionable than an abstract recommendation

Sentences like the following rarely lead to action:

> 오늘은 새로운 경험을 해보세요.

Odday turns this into a concrete action:

> 평소 가던 길과 반대 방향으로 5분만 걸어보세요.

The user can act immediately without agonizing over what to do.

---

### Hypothesis 3. Actions occur that wouldn't have happened without the quest

Odday's core value is not in users rating a quest as fun.

The following behavior must occur:

> Because of Odday, the user actually does something they wouldn't otherwise have done.

We define this as Odday's core outcome.

---

### Hypothesis 4. Recording the results of actions increases the likelihood of repeat use

Performing a quest just once risks Odday becoming a one-time service.

If performance results accumulate into records like the following, long-term value can emerge:

- The first place visited this month
- The number of times acting differently than usual
- The quest with the highest satisfaction
- The most unexpected experience
- Actions that wouldn't have happened without Odday
- The user's quest tendencies

---

## 5. MVP deployment method

The Odday MVP is developed as a static web application and deployed via GitHub Pages.

The deployed service is exposed externally through these channels:

- GitHub repository
- GitHub Pages
- LinkedIn profile
- LinkedIn posts
- Personal portfolio
- Sharing with acquaintances
- Interest-area communities

Reasons for using GitHub Pages:

- Almost no separate server operating cost.
- Fast to fix and redeploy.
- Directly links the GitHub project to the live service.
- Usable as a portfolio project.
- Provides a web app sufficient for early behavior validation.

---

## 6. GitHub project setup

### Repository name

```text
odday
```

Depending on the situation, these names may also be used:

```text
odday-app
odday-web
odday-mvp
```

Prefer the simplest, `odday`.

### GitHub Pages address example

```text
https://{username}.github.io/odday/
```

### Page title

```text
Odday
```

### Default description

```text
Make today a little odd.
```

Or in Korean:

```text
오늘을 조금 이상하게.
```

---

## 7. Purpose of the LinkedIn connection

The LinkedIn connection serves two purposes.

### 7.1 Early user acquisition

Acquire early visitors through the LinkedIn profile or posts.

Through this we can check:

- Whether the name and message of Odday are understood
- Whether users start acting on the first screen
- Whether the quest-selection process feels natural
- Whether it leads to actual completion
- Whether users request the next quest after completion

---

### 7.2 Portfolio use

Odday isn't just a UI-implementation project; it can serve as a portfolio demonstrating:

- Product idea articulation
- Core hypothesis definition
- MVP scope setting
- User behavior funnel design
- Event-based data collection
- Anonymous user analysis
- Product improvement based on experiment results
- Actual service deployment and operation

That said, LinkedIn-sourced users are likely to differ from general users.

LinkedIn visitors may have these traits:

- A high proportion of developers or office workers
- Interest in the project implementation itself
- Approaching from a portfolio rather than a service perspective
- Many are acquaintances connected to the author
- Likely to give more favorable feedback than general users

So LinkedIn data can be used for early usability validation, but must not be interpreted as data representing the whole market.

---

## 8. Core user flow

The basic user flow of the Odday MVP is:

```text
Visit Odday
→ Select current situation
→ View candidate quests
→ Select a quest
→ Perform the quest in reality
→ Record completion status
→ Submit short feedback
→ Request the next quest
→ Revisit or share
```

Each step is designed so we can distinguish the user's intent from the cause of drop-off.

---

## 9. First-screen composition

Odday's first screen is composed to let users start acting immediately, rather than explaining the service.

### Main copy

> 오늘을 조금 이상하게.

### Sub copy

> 지금 상황에 맞는 작은 현실 퀘스트를 받아보세요.

### Primary action button

```text
오늘의 Odday 시작하기
```

Alternative expressions:

```text
퀘스트 받아보기
오늘을 바꿔보기
작은 사건 만들기
```

The MVP uses `오늘의 Odday 시작하기` as the default label.

---

## 10. MVP feature scope

### 10.1 Current-situation selection

The user selects the conditions they can currently act under.

Example conditions:

- Indoor / outdoor
- Alone / together
- 1 min / 5 min / 20 min
- Comfortable action / new action / action requiring a bit of courage
- No cost / small spend possible
- Home / office / outside

Requiring all conditions raises the barrier to starting.

The early MVP prioritizes these three:

- Current location: indoor / outdoor
- Participation form: alone / together
- Available time: 1 min / 5 min / 20 min

---

### 10.2 Candidate quest provision

Based on the selected conditions, provide about 3 quests.

Example:

#### 가벼운 Odday

> 지금 주변에서 가장 오래돼 보이는 물건을 찾아보세요.

#### 조금 낯선 Odday

> 평소 자세히 보지 않았던 공간을 하나 골라 이상한 점을 찾아보세요.

#### 약간의 모험

> 평소 가지 않던 방향으로 10분간 걸은 뒤 가장 눈에 띄는 장소를 기록해보세요.

The user can pick one or skip them all.

---

### 10.3 Quest detail information

Each quest displays the following information:

- Quest title
- Short description
- Estimated time
- Indoor or outdoor
- Alone or together
- Activity intensity
- Whether it costs money

Example:

```text
퀘스트: 가장 이상한 물건 찾기
시간: 약 3분
장소: 실내
인원: 혼자 또는 함께
비용: 없음
강도: 가벼움
```

---

### 10.4 Quest performance

Quest completion is not strictly verified.

In the early MVP, the user marks completion themselves.

Possible completion methods:

- Complete button
- Short text note
- Satisfaction selection
- Optional photo record

For the early version, it's best to exclude photo upload or support browser-local storage only.

Storing photos on a server creates these problems:

- Personal information
- Location exposure
- Storage capacity
- Deletion policy
- Inappropriate-content moderation
- Operating cost

---

### 10.5 Post-completion feedback

After completion, offer only one or two questions instead of a long survey.

#### Core question

> Odday가 없었다면 실제로 이 행동을 했을까요?

Options:

- 전혀 하지 않았을 것이다.
- 아마 하지 않았을 것이다.
- 상황에 따라 했을 수도 있다.
- 원래 할 예정이었다.

#### Follow-up question

> 비슷한 Odday를 다시 해보고 싶나요?

Options:

- 바로 다른 퀘스트도 해보고 싶다.
- 다음에 다시 해보고 싶다.
- 한 번이면 충분하다.
- 별로 하고 싶지 않다.

---

### 10.6 Skipping a quest

When the user doesn't select a quest, collect the reason.

Keep the options simple:

- 재미없어 보임
- 너무 귀찮음
- 지금 상황과 맞지 않음
- 시간이 부족함
- 혼자 하기 싫음
- 결과 기록이 부담스러움
- 너무 유치하게 느껴짐
- 다른 종류의 퀘스트를 원함
- 기타

This data is used to distinguish a problem with the quest content itself from a situation-mismatch problem.

---

### 10.7 Requesting the next Odday

After completing a quest, let the user request a new one.

This action is an important indicator for judging the likelihood of repeat use.

Right after completion, we can offer these options:

- 비슷한 퀘스트 받기
- 조금 더 어려운 퀘스트 받기
- 완전히 다른 퀘스트 받기
- 오늘은 여기까지

---

### 10.8 Personal records

Records of what the user performed are initially stored only in the browser.

Example stored fields:

- Performance date
- Quest title
- Quest category
- Completion status
- Satisfaction
- Optional one-line note

Using `localStorage` without login, we can provide a basic timeline without storing personal records on a server.

### Record-screen title examples

```text
My Oddays
```

Or in Korean:

```text
나의 이상한 날들
Odday 기록
작은 사건들
```

The MVP may use `My Oddays` or `Odday 기록`.

---

## 11. Quest categories

Odday quests are divided into the following categories.

### 관찰 (Observation)

Quests that make the user look at their surroundings more closely than usual.

- 같은 색 물건 5개 찾기
- 가장 이상한 간판 찾기
- 오늘 처음 본 문장 기록하기
- 계절이 바뀌었다는 증거 찾기

---

### 탐험 (Exploration)

Quests that let the user experience an unfamiliar place or route.

- 평소 가지 않던 골목 들어가기
- 다른 출입구 사용하기
- 한 정거장 먼저 내려보기
- 지도 없이 10분 걷기

---

### 감각 (Senses)

Quests that focus on the five senses.

- 주변 소리 세 가지 구분하기
- 노래 한 곡을 아무것도 하지 않고 듣기
- 처음 보는 음료 맛보기
- 주변의 가장 강한 냄새 찾기

---

### 정리 (Tidying)

Quests that make a small change in daily life.

- 물건 하나 버리기
- 사용하지 않는 앱 하나 삭제하기
- 가장 오래된 사진 다섯 장 보기
- 냉장고의 정체불명 소스 확인하기

---

### 관계 (Relationships)

Quests that create a small event with another person.

- 구체적인 감사 한마디 전하기
- 오랫동안 연락하지 않은 사람 떠올리기
- 함께 있는 사람의 취향 추측하기
- 상대방에게 사진 한 장 보내기

---

### 창작 (Creation)

Quests that produce a small artifact.

- 오늘 하루의 제목 짓기
- 주변 사물로 얼굴 만들기
- 세 문장짜리 이야기 쓰기
- 이상한 제품 이름 만들기

---

### 회상 (Recollection)

Quests that bring out past memories.

- 가장 오래된 사진 찾기
- 학창 시절 좋아했던 음악 듣기
- 오래전에 살던 동네 지도 보기
- 가족에게 오래된 물건의 사연 묻기

---

### 용기 (Courage)

Quests that push the user past a bit of psychological resistance.

- 평소 주문하지 않던 메뉴 선택하기
- 미뤄둔 짧은 전화 걸기
- 혼자 새로운 장소 방문하기
- 궁금했던 것을 직접 질문하기

---

## 12. Features excluded from the MVP

The early validation stage excludes the following features:

- Augmented reality
- Map-based quests
- Precise GPS location collection
- Sign-up
- Follow and social feed
- Experience points and levels
- A complex badge system
- Real-time chat
- User rankings
- Paid transactions
- AI-based infinite quest generation
- 3D characters
- A quest-creator platform
- Push notifications
- A native mobile app

These are high-effort to build but not directly needed to validate Odday's core hypotheses.

---

## 13. Anonymous data-collection principles

The Odday MVP avoids collecting personally identifiable information as much as possible.

### Information NOT collected

- Name
- Email
- Phone number
- Precise address
- Precise GPS coordinates
- Contacts
- Personal profile
- Unnecessary device information
- The user's original photos
- The user's detailed activity location

### Information that MAY be collected

- Anonymous visitor identifier
- Session identifier
- Page visits
- Quest impressions
- Quest selections
- Quest skips
- Quest completions
- Next-quest requests
- Share-button clicks
- Referral path
- Selected situation conditions
- Satisfaction
- Whether an action was triggered

The anonymous identifier can be a random UUID generated in the browser.

```ts
const VISITOR_ID_KEY = "odday-visitor-id";

export function getOddayVisitorId(): string {
  const storedVisitorId = localStorage.getItem(VISITOR_ID_KEY);

  if (storedVisitorId) {
    return storedVisitorId;
  }

  const visitorId = crypto.randomUUID();
  localStorage.setItem(VISITOR_ID_KEY, visitorId);

  return visitorId;
}
```

This identifier is not linked to a user's name or contact information.

However, since an anonymous identifier is still data for distinguishing returning visitors, it's stated in the site's privacy and analytics notice.

---

## 14. Event design

The early analytics events are composed at this level.

```ts
type OddayAnalyticsEvent =
  | {
      type: "page_view";
      referrer?: string;
    }
  | {
      type: "odday_started";
    }
  | {
      type: "context_selected";
      place: "indoor" | "outdoor";
      party: "alone" | "together";
      duration: "1m" | "5m" | "20m";
    }
  | {
      type: "quest_impression";
      questId: string;
      category: string;
    }
  | {
      type: "quest_selected";
      questId: string;
      category: string;
    }
  | {
      type: "quest_skipped";
      questId: string;
      reason?: string;
    }
  | {
      type: "quest_started";
      questId: string;
    }
  | {
      type: "quest_completed";
      questId: string;
      elapsedBucket?: "under_5m" | "5_20m" | "over_20m";
    }
  | {
      type: "quest_feedback_submitted";
      questId: string;
      wouldNotHaveDoneWithoutOdday: boolean;
      retryIntent: "high" | "medium" | "low" | "none";
    }
  | {
      type: "next_quest_requested";
      previousQuestId: string;
      requestType: "similar" | "harder" | "different";
    }
  | {
      type: "share_clicked";
      questId: string;
      channel?: string;
    }
  | {
      type: "history_viewed";
    };
```

---

## 15. Core analytics funnels

### 15.1 First-action funnel

```text
Visit Odday
→ Click the start button
→ Select situation
→ Quest impression
→ Select quest
```

This funnel judges whether the first screen and value proposition are attractive enough.

---

### 15.2 Performance funnel

```text
Select quest
→ Start quest
→ Complete quest
→ Submit completion feedback
```

This funnel judges whether users merely show interest or actually follow through with action.

---

### 15.3 Repeat-use funnel

```text
Complete quest
→ Request next quest
→ Additional completion within the same session
→ Revisit a few days later
```

This funnel judges whether Odday stops at one-time curiosity.

---

### 15.4 Share funnel

```text
Complete quest
→ Click share button
→ New visit via the share link
```

This funnel judges relational-service or viral potential.

---

## 16. Key metrics

### 16.1 Odday start rate

```text
Number of users who clicked the start button
/ Number of users who visited Odday
```

Judges whether the first screen conveys enough service value.

---

### 16.2 Quest selection rate

```text
Number of users who selected a quest
/ Number of users who saw quests
```

Judges whether the quests themselves look attractive.

---

### 16.3 Quest completion rate

```text
Number of users who completed a quest
/ Number of users who selected a quest
```

Judges whether the actual behavior cost is appropriate.

---

### 16.4 Action-trigger rate

```text
Number of users who answered "I wouldn't have done it without Odday"
/ Number of users who completed a quest
```

The most important metric for Odday.

Confirms that we didn't just provide fun content, but actually produced behavior change.

---

### 16.5 Next-quest request rate

```text
Number of users who requested the next quest
/ Number of users who completed a quest
```

Confirms the likelihood of repeat use.

---

### 16.6 Revisit rate

```text
Number of anonymous users who visited again within a period
/ Number of first-time visitors
```

Checked on a 1-day and 7-day basis.

Early on, inflow may be low, so analyze actual user behavior alongside the absolute ratio.

---

### 16.7 Share-attempt rate

```text
Number of users who clicked the share button
/ Number of users who completed a quest
```

Confirms whether the quest result is worth showing to others.

---

## 17. Data interpretation criteria

### Many visits but no start-button clicks

Possible causes:

- Odday isn't understood
- The first-screen copy is abstract
- The value the user gets isn't visible
- It looks like a portfolio page
- The impression of a real service is weak

Improvement directions:

- Show example quests immediately
- Reduce first-screen explanation
- Use action-focused copy
- Emphasize the start button
- Provide examples of actual performance results

---

### Started but didn't finish situation selection

Possible causes:

- Too many options
- Entering conditions is tedious
- Unclear why conditions must be entered
- Wants to see quests right away

Improvement directions:

- Reduce the number of conditions
- Provide defaults
- Show one question at a time
- Add a path that provides a random quest without condition selection

---

### Sees quests but doesn't select

Possible causes:

- The quests are childish
- They don't fit the current situation
- The action results aren't attractive
- The options are too similar to each other
- The execution cost looks high

Improvement directions:

- Improve quest wording
- Diversify categories
- Refine situation conditions
- Clarify estimated time and cost
- Distinguish light choices from challenging ones

---

### Selects a quest but doesn't complete it

Possible causes:

- High behavior cost
- Requires movement
- Takes a long time
- Forgets to return to the completion screen
- Recording the result feels burdensome
- Not interesting enough to actually execute

Improvement directions:

- Offer shorter quests
- Clearly show estimated time before starting
- Simplify completion recording
- Expand quests that require no going out
- Provide the ability to mark completion later

---

### Completes but doesn't request the next quest

Possible causes:

- One experience is enough
- The quest result was weaker than expected
- No reason to repeat
- No anticipation for the next quest
- The value of accumulating records isn't visible

Improvement directions:

- Sequential quest chapters
- Provide personal records
- Difficulty selection
- Introduce relational quests
- Quest-tendency analysis
- Provide a monthly Odday retrospective

---

### Shares but doesn't revisit

Possible causes:

- The quest is funny but has weak lasting value
- The result image is more attractive than the quest
- It has a strong one-time-event character

In this case, consider reshaping Odday into something other than a repeat-use service:

- A shareable result-card generator
- A tool for sending quests to friends
- Quest packs for gatherings
- One-time content for dates

---

## 18. Referral-path measurement

To check behavior differences by referral path, use URL query parameters.

```text
?ref=linkedin-profile
?ref=linkedin-post
?ref=github
?ref=portfolio
?ref=friend
?ref=community
```

Compare the following by referral path:

- Odday start rate
- Quest selection rate
- Completion rate
- Action-trigger rate
- Next-quest request rate
- Revisit rate
- Share rate

Since LinkedIn-sourced users are likely interested in the portfolio, analyze them separately from other referral paths.

---

## 19. Analytics-tool candidates

Because GitHub Pages provides only static hosting, analytics uses an external tool.

Candidates:

- PostHog
- Plausible
- Umami
- Google Analytics
- Supabase
- A self-built event API

The Odday MVP prioritizes these criteria:

- Easy custom event collection
- Ability to view funnels
- Ability to analyze anonymous users
- A sufficient free tier
- Simple integration with GitHub Pages

Early on, an event-centric analytics tool like PostHog or Umami is a good fit.

---

## 20. Early success criteria

Early success isn't judged by page-visit count alone.

We check whether the following behaviors actually occur.

Example criteria:

- Odday start rate ≥ 40% of visits
- Selection rate ≥ 30% of quest impressions
- Completion rate ≥ 30% of quest selections
- Action-trigger response ≥ 50% of completing users
- Next-quest request rate ≥ 20% of completing users
- Revisiting users appear
- Share-button usage occurs
- Users spontaneously request new quests
- Users leave the optional one-line feedback

If the early sample is small, look at the quality of actual behavior alongside the ratios.

For example, these behaviors are strong signals:

- The user requests the next quest first
- The user describes the quest result at length
- The user says they'd like to do it with someone
- The user directly shares the Odday link with a friend
- The user revisits a few days later
- The user repeatedly selects a particular quest category
- The user shows interest in a paid quest pack

---

## 21. Warning signs

If the following results repeat, Odday's service direction should be re-examined.

- There are visitors but they don't press the start button
- Most only look at quests and don't select
- Selecting users don't follow through to actual behavior
- They complete but don't want the next quest
- Users feel the quests are childish
- Completion rate drops sharply at the moment movement is required
- Most drop off during the recording or verification process
- Little response outside of LinkedIn acquaintances
- Interest only in the portfolio implementation rather than the quests themselves
- No repeat use even with free usage

---

## 22. Future expansion directions

After positive signals are confirmed in the MVP, consider the following features.

### 22.1 Personalization

- Learning preferred categories
- Excluding skipped quest types
- Time-of-day-based recommendations
- Duplicate prevention based on completion history
- Automatic difficulty adjustment
- Analysis of the user's execution patterns

---

### 22.2 Relational features

- Sending an Odday to a friend or partner
- Revealing the result after both complete it
- Quests performed together
- Records by relationship
- Couple or family quest packs
- Forwarding a quest created by the other person

---

### 22.3 Memory records

- Monthly Odday retrospective
- Records of performed experiences
- Photos and one-line notes
- Personal adventure cards
- Annual Odday report
- Analysis of the user's quest tendencies

Example:

> 이번 달 당신은 평소와 다른 길을 세 번 선택했고, 새로운 음식을 두 번 시도했으며, Odday가 없었다면 하지 않았을 행동을 다섯 번 수행했습니다.

---

### 22.4 Content expansion

- A weekend alone
- Couple dates
- Friend gatherings
- With a child
- After work for office workers
- Exploring a new neighborhood
- Travel-destination quests
- Rainy days
- Indoor-only
- Quests that spend no money
- Quests under 5 minutes

---

### 22.5 Monetization

- Themed Odday packs
- Couple quest packs
- Family quest packs
- Local-exploration packs
- Monthly personalized quests
- A digital record book
- Physical cards
- A photo book
- Quest packs for gatherings
- Brand-collaboration quests

---

## 23. Brand expansion directions

The name Odday expresses the brand's sentiment rather than a specific feature.

So the name is easy to keep even as features expand later.

Possible brand expressions:

### Service name

```text
Odday
```

### Default tagline

```text
Make today a little odd.
```

### Korean tagline

```text
오늘을 조금 이상하게.
```

### Supporting phrases

```text
평범한 하루에 작은 사건 하나.
```

```text
원래 하지 않았을 일을 해보는 날.
```

```text
오늘은 평소와 조금 다르게.
```

```text
아무 일 없이 지나갈 하루를 바꿔보세요.
```

---

## 24. UI copy examples

### Start screen

```text
오늘을 조금 이상하게.
지금 상황에 맞는 작은 현실 퀘스트를 받아보세요.
```

### Quest provision screen

```text
오늘의 Odday를 골라보세요.
```

### Start quest

```text
이걸 해볼래요.
```

### Skip quest

```text
오늘은 이건 별로예요.
```

### Complete button

```text
해봤어요.
```

### Post-completion message

```text
오늘이 조금 달라졌네요.
```

### Next-quest request

```text
다른 Odday도 받아보기
```

### Record screen

```text
당신의 이상한 날들
```

---

## 25. Final judgment criteria

The most important question the Odday MVP must answer is:

> Beyond finding Odday's quests interesting, do users actually move their bodies and act differently than usual?

The next question is:

> After one experience, do they want to perform another Odday?

If these two aren't confirmed, adding AR, maps, game systems, or social features won't solve the core problem.

Conversely, if this behavior is confirmed, later technology can be used to reinforce the motivation and experience of use.

---

## 26. One-line summary

> Odday is a GitHub Pages-based MVP that proposes small real-world quests for an ordinary day and validates, through anonymous behavior data, whether users actually act differently than usual.
