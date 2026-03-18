export interface ExcelPartConfig {
  question: string;
  idealAnswer: string;
  scoringCriteria: string;
  expectsFileUpload?: boolean;
  uploadFileName?: string;
}

export interface ExcelModuleConfig {
  id: string;
  initialQuestion: string;
  idealAnswer: string;
  scoringCriteria: string;
  goalText: string;
  durationText: string;
  prepareItems: string[];
  expectsFileUpload?: boolean;
  uploadFileName?: string;
  part2?: ExcelPartConfig;
  part3?: ExcelPartConfig;
}

export const EXCEL_MODULE_CONFIGS: Record<string, ExcelModuleConfig> = {
  excel_tables_arrays: {
    id: 'excel_tables_arrays',
    expectsFileUpload: true,
    uploadFileName: 'Tables.xlsx',
    initialQuestion: `Download <a href="/exercise-files/Tables.xlsx" download class="text-[#0a66c2] hover:underline">Tables.xlsx</a> and open it in Excel. You'll see two sections side by side:
• <strong>TABLE</strong> section (columns B–F) — data formatted as an Excel Table, with <strong>Meal Total</strong> and <strong>Lodging Avg Cost</strong> summary formulas that use <strong>structured references</strong>.
• <strong>RANGE</strong> section (columns H–L) — the same data as a plain range, with summary formulas that use <strong>absolute cell references</strong> like <code>$J$5:$J$17</code>.

<strong>Your goal:</strong> Revise the RANGE section so that the summary formulas in cells <strong>J3</strong> and <strong>L3</strong> use <strong>structured references</strong> instead of absolute cell references — just like the TABLE section's formulas do.

Save and upload your file below.`,
    idealAnswer: `The file should show the RANGE data (H4:J17) converted to an Excel Table (indicated by banded rows, filter dropdowns on headers, and a Table name in the Table Design tab). The summary formulas in the RANGE section (J3 and L3) should now use structured references like Table2[Expense] or Table2[Category] instead of the original absolute cell references like $J$5:$J$17.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Evaluate whether the RANGE data has been converted to a Table and whether the RANGE section's summary formulas now use structured references.

- 5 (Expert): RANGE data converted to a Table AND its Meal Total and Lodging Avg Cost formulas both use structured references (e.g., Table2[Expense] instead of $J$5:$J$17).
- 4 (Proficient): RANGE data converted to a Table with structured references present in at least one summary formula.
- 3 (Competent): RANGE data converted to a Table but summary formulas still use absolute references, or conversion is partial.
- 2 (Basic): File shows an attempt at Table conversion but it's incomplete or incorrect.
- 1 (Novice): No Table conversion found in the RANGE section.

SCORING DECISION TREE:
1. Is the RANGE data (H4:J17) converted to a Table? → If NO, max Level 3.
2. If YES: Do the RANGE summary formulas (Meal Total and Lodging Avg Cost) use structured references? → If NO, score Level 3.
3. If YES (Table + structured references in at least one formula): Score Level 4.
4. Do both summary formulas use correctly formed structured references? → Score Level 5.

ERROR HANDLING: If the file contains a Table but formulas still use absolute references like $J$5:$J$17, note that conversion should update formulas automatically — the learner may need to re-check. Cap at Level 3.`,
    goalText: "Convert a range to a Table and observe structured references.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Tables</em> and <em>Tables and absolute cell references</em>'
    ],
    part2: {
      question: `Now for Part 2:

You manage a sales tracking spreadsheet that is growing fast. The data is in a plain range with formulas using absolute references like <strong>$A$2:$A$500</strong>. Every month you add new rows and have to manually update every formula range. A colleague suggests converting the range to a Table.

Name <strong>2 specific benefits</strong> of converting the range to a Table.`,
      idealAnswer: `Benefits of Tables:
(a) Structured references auto-expand — when you add new rows, formulas automatically include them without manual range updates.
(b) Built-in filtering, sorting, banded rows, and automatic formatting. Also: column headers stay visible when scrolling, and calculated columns auto-fill formulas down the entire column.

Other valid benefits: total row toggle, automatic naming for easy reference in other formulas, better readability with descriptive column names instead of cell addresses.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies 2+ Table benefits including auto-expanding ranges AND at least one more (filtering, banded rows, calculated columns, headers staying visible). Shows clear understanding of why Tables solve the manual-update problem.
- 4 (Proficient): Identifies 2 clear benefits with reasonable accuracy.
- 3 (Competent): Identifies 1 benefit clearly or 2 benefits vaguely.
- 2 (Basic): Gives vague answers about Tables being "better" without specifics.
- 1 (Novice): Off-topic or does not demonstrate understanding of Tables.

SCORING DECISION TREE:
1. Does the response correctly identify 2 specific Table benefits? → If NO, max Level 3.
2. If YES: Are there factual errors (e.g., claiming Tables don't auto-expand)? → If YES, score Level 3 and flag error first.
3. If YES (2 benefits) AND NO errors: Score Level 4.
4. Does it show deeper understanding (structured references are self-documenting, calculated columns auto-fill, headers persist when scrolling)? → Score Level 5.

ERROR HANDLING: If the response claims Tables require manual range updates, flag this error FIRST. This is a fundamental misconception. Caps at Level 3 maximum.`
    }
  },

  excel_dynamic_intro: {
    id: 'excel_dynamic_intro',
    expectsFileUpload: true,
    uploadFileName: 'UNIQUE.xlsx',
    initialQuestion: `Download <a href="/exercise-files/UNIQUE.xlsx" download class="text-[#0a66c2] hover:underline">UNIQUE.xlsx</a> and open it in Excel. You'll see a list of Excel experts and their favorite Excel function.

<strong>Your goal:</strong> In an empty area of the sheet, create two dynamic results using single formulas (one formula each):
<strong>(A)</strong> The full list sorted alphabetically by <strong>Favorite Excel Function</strong> (column C).
<strong>(B)</strong> A list showing only experts whose favorite function is <strong>"VLOOKUP"</strong>.

Save and upload your file below.`,
    idealAnswer: `The file should contain two new dynamic array formulas in empty cells:
(A) A SORT formula like =SORT(B3:C27, 2, 1) that produces a spilled list sorted alphabetically by the Favorite Excel Function column.
(B) A FILTER formula like =FILTER(B3:C27, C3:C27="VLOOKUP") that produces a spilled list showing only VLOOKUP experts.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for SORT and FILTER formulas in the extracted cell data.

- 5 (Expert): File contains both a correct SORT formula (sorting by column C) AND a correct FILTER formula (filtering for "VLOOKUP"), with results spilling into adjacent cells.
- 4 (Proficient): File contains both formulas with correct structure.
- 3 (Competent): File contains one of the two formulas correctly, or both with minor issues.
- 2 (Basic): File contains an attempt at one formula but with significant errors.
- 1 (Novice): No SORT or FILTER formulas found in the file.

SCORING DECISION TREE:
1. Does the file contain both a SORT and a FILTER formula? → If NO, max Level 3.
2. If YES: Are there errors (e.g., FILTER used to sort, or wrong criteria)? → If YES, score Level 3.
3. If YES (both correct) AND NO errors: Score Level 4.
4. Do both formulas reference the correct data ranges and produce spilled results? → Score Level 5.

ERROR HANDLING: If SORT and FILTER are confused (e.g., using SORT to filter by criteria), flag this FIRST. Caps at Level 3.`,
    goalText: "Practice SORT and FILTER with real data, then explain spill behavior.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Dynamic arrays introduction</em>'
    ],
    part2: {
      question: `Now for Part 2:

In your own words, explain what <strong>"spilling"</strong> means in the context of dynamic arrays. How does it differ from the legacy <strong>Ctrl+Shift+Enter</strong> approach?`,
      idealAnswer: `"Spilling" means a single formula in one cell returns multiple results that automatically fill into adjacent cells. The spill range adjusts dynamically as data changes.

The legacy approach required pre-selecting the exact output range and pressing Ctrl+Shift+Enter. With dynamic arrays, you just type the formula and press Enter — Excel handles the rest.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Clearly explains spilling (one formula, multiple results, auto-expanding) AND contrasts with CSE legacy arrays (pre-select range, fixed output). Mentions dynamic resizing.
- 4 (Proficient): Explains spilling and the CSE difference with reasonable accuracy.
- 3 (Competent): Understands spilling conceptually but explanation of CSE difference is vague.
- 2 (Basic): Vague awareness of dynamic arrays without clear explanation.
- 1 (Novice): Cannot explain spilling or dynamic arrays.

SCORING DECISION TREE:
1. Does the response explain spilling (one formula returning multiple results)? → If NO, max Level 3.
2. If YES: Does it contrast with the CSE legacy approach? → If NO, max Level 4.
3. If YES (spilling + CSE contrast) AND NO errors: Score Level 4.
4. Does it mention dynamic resizing and elimination of pre-selecting ranges? → Score Level 5.

ERROR HANDLING: If the response claims dynamic arrays still require Ctrl+Shift+Enter, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_conditionals: {
    id: 'excel_conditionals',
    expectsFileUpload: true,
    uploadFileName: 'SUMIFS-COUNTIFS.xlsx',
    initialQuestion: `Your manager asks: <em>"What's the largest single online donation we've received?"</em>

Download <a href="/exercise-files/SUMIFS-COUNTIFS.xlsx" download class="text-[#0a66c2] hover:underline">SUMIFS-COUNTIFS.xlsx</a> and open the <strong>Donations</strong> sheet.

<strong>Your goal:</strong> In an empty cell, write a single formula that finds the highest <strong>Donation</strong> amount (column B) where the <strong>Payment</strong> method (column C) is <strong>"Online"</strong>.

Save and upload your file below.`,
    idealAnswer: `The file should contain a MAXIFS formula like =MAXIFS(B:B, C:C, "Online") that returns the largest Donation amount (column B) where Payment (column C) is "Online".`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a MAXIFS formula in the extracted cell data.

- 5 (Expert): File contains a correct MAXIFS formula with max_range referencing the Donation column (B) and criteria_range/criteria referencing Payment column (C) with "Online".
- 4 (Proficient): File contains a correct MAXIFS formula with appropriate arguments.
- 3 (Competent): File contains a MAXIFS attempt but with incomplete arguments, or uses MAX without criteria.
- 2 (Basic): File contains a formula attempt but it's not a valid MAXIFS.
- 1 (Novice): No MAXIFS formula found in the file.

SCORING DECISION TREE:
1. Does the file contain a MAXIFS formula? → If NO, max Level 3.
2. If YES: Are there argument errors (e.g., wrong column references)? → If YES, score Level 3.
3. If YES (correct formula) AND NO errors: Score Level 4.
4. Does the formula correctly reference the Donation and Payment columns with "Online" criteria? → Score Level 5.

ERROR HANDLING: If the file contains MAX instead of MAXIFS (ignoring the "Online" filter), flag that MAXIFS is needed for conditional maximum. Cap at Level 3.`,
    goalText: "Apply MAXIFS to find a conditional maximum, then write an IF+AND formula.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>IF function</em> and <em>MAXIFS, MINIFS, and AVERAGEIFS</em>'
    ],
    part2: {
      question: `Now for Part 2:

You're analyzing employee training data. Your manager asks for a formula to display <strong>"Certified"</strong> if the score is 80 or above AND the status is "Pass", otherwise <strong>"Needs Retake."</strong>

Which function(s) would you use, and write out the formula logic?`,
      idealAnswer: `Use IF with AND: =IF(AND(Score>=80, Status="Pass"), "Certified", "Needs Retake"). AND is needed because both conditions must be true simultaneously.

Alternative: nested IF — =IF(Score>=80, IF(Status="Pass", "Certified", "Needs Retake"), "Needs Retake") — but AND is cleaner.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies IF with AND (or nested IF), writes accurate formula logic, AND explains why both conditions are needed.
- 4 (Proficient): Correctly identifies IF+AND with a reasonable formula and explanation.
- 3 (Competent): Identifies IF but misses AND or writes incomplete logic.
- 2 (Basic): Mentions IF but can't construct the multi-condition logic.
- 1 (Novice): Cannot identify the appropriate function.

SCORING DECISION TREE:
1. Does the response correctly use IF with AND (or equivalent nested IF) for both conditions? → If NO, max Level 3.
2. If YES: Are there logic errors (e.g., using OR instead of AND)? → If YES, score Level 3.
3. If YES (correct logic) AND NO errors: Score Level 4.
4. Does it explain why AND is needed (both conditions must be true) and provide clean formula syntax? → Score Level 5.

ERROR HANDLING: If the response uses OR instead of AND (which would certify employees who only meet one condition), flag this FIRST. Caps at Level 3 maximum.`
    }
  },

  excel_sumifs_practice: {
    id: 'excel_sumifs_practice',
    expectsFileUpload: true,
    uploadFileName: 'SUMIFS-COUNTIFS.xlsx',
    initialQuestion: `Download <a href="/exercise-files/SUMIFS-COUNTIFS.xlsx" download class="text-[#0a66c2] hover:underline">SUMIFS-COUNTIFS.xlsx</a> and open the <strong>Donations</strong> sheet.

<strong>Your goal:</strong> In an empty cell, write a single formula that counts how many donations were made where <strong>Payment</strong> (column C) is <strong>"Online"</strong> AND <strong>Recurring</strong> (column D) is marked <strong>"x"</strong>. Both conditions must be met.

Save and upload your file below.`,
    idealAnswer: `The file should contain a COUNTIFS formula like =COUNTIFS(C:C, "Online", D:D, "x") that counts donations where Payment (column C) is "Online" AND Recurring (column D) is "x". COUNTIFS (plural) is needed for two criteria, with each criteria range and value coming in pairs.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for COUNTIFS formulas in the extracted cell formulas. Evaluate the formula structure and correctness.

- 5 (Expert): File contains a correct COUNTIFS formula with 2 properly paired criteria_range/criteria arguments referencing meaningful data columns.
- 4 (Proficient): File contains a correct COUNTIFS formula with 2 criteria.
- 3 (Competent): File contains a COUNTIFS attempt but has incomplete arguments or uses COUNTIF (singular).
- 2 (Basic): File contains a formula attempt but it's not a valid COUNTIFS formula.
- 1 (Novice): No COUNTIFS formula found in the file.

SCORING DECISION TREE:
1. Does the file contain a COUNTIFS formula with 2 paired criteria ranges and values? → If NO, max Level 3.
2. If YES: Are there errors (e.g., using COUNTIF instead of COUNTIFS for 2 criteria)? → If YES, score Level 3.
3. If YES (correct formula) AND NO errors: Score Level 4.
4. Does the formula use meaningful criteria from the actual data columns? → Score Level 5.

ERROR HANDLING: If the file contains COUNTIF (singular) for multiple criteria, flag this FIRST — COUNTIF only handles one criterion. Caps at Level 3.`,
    goalText: "Apply COUNTIFS to real data with multiple criteria.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>SUMIFS and COUNTIFS</em>',
      'Practice file: <a href="/exercise-files/SUMIFS-COUNTIFS.xlsx" download class="text-[#0a66c2] hover:underline">SUMIFS-COUNTIFS.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      expectsFileUpload: true,
      uploadFileName: 'SUMIFS-COUNTIFS.xlsx',
      question: `Now for Part 2:

Using the same <a href="/exercise-files/SUMIFS-COUNTIFS.xlsx" download class="text-[#0a66c2] hover:underline">SUMIFS-COUNTIFS.xlsx</a> file (Donations sheet):

<strong>Your goal:</strong> In an empty cell, write a single formula that totals the <strong>Donation</strong> amounts (column B) where <strong>Payment</strong> (column C) is <strong>"Online"</strong> AND <strong>Recurring</strong> (column D) is <strong>"x"</strong>.

Save and upload your file below.`,
      idealAnswer: `The file should contain a SUMIFS formula like =SUMIFS(B:B, C:C, "Online", D:D, "x") that sums the Donation column (B) for rows where Payment (C) is "Online" AND Recurring (D) is "x". Note that in SUMIFS the sum_range comes first, followed by criteria pairs.`,
      scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for SUMIFS formulas in the extracted cell formulas. Evaluate the formula structure and correctness.

- 5 (Expert): File contains a correct SUMIFS formula with sum_range as the first argument followed by criteria pairs. The formula references appropriate data columns.
- 4 (Proficient): File contains a correct SUMIFS formula with appropriate arguments.
- 3 (Competent): File contains a SUMIFS attempt but has argument ordering issues or incomplete criteria.
- 2 (Basic): File contains a formula attempt but it's SUMIF (singular) or has significant issues.
- 1 (Novice): No SUMIFS formula found or formula is completely incorrect.

SCORING DECISION TREE:
1. Does the file contain a SUMIFS formula with sum_range first and paired criteria? → If NO, max Level 3.
2. If YES: Are there argument ordering errors (e.g., criteria before sum_range)? → If YES, score Level 3 and flag.
3. If YES (correct formula) AND NO errors: Score Level 4.
4. Does the formula use meaningful criteria and reference appropriate data ranges? → Score Level 5.

ERROR HANDLING: If the file contains SUMIF (singular) instead of SUMIFS for multiple criteria, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_lookup_basics: {
    id: 'excel_lookup_basics',
    expectsFileUpload: true,
    uploadFileName: 'VLOOKUP.xlsx',
    initialQuestion: `Download <a href="/exercise-files/VLOOKUP.xlsx" download class="text-[#0a66c2] hover:underline">VLOOKUP.xlsx</a> and open it in Excel. You'll see a <strong>Transactions</strong> sheet (with ID and Amount columns) and a <strong>Reps & Levels</strong> sheet (with ID, Name, and Specialization in columns B–D).

<strong>Your goal:</strong> On the <strong>Reps & Levels</strong> sheet, in empty columns, pull each rep's <strong>Amount</strong> from the Transactions sheet using their <strong>ID</strong>. Write the lookup <strong>two different ways</strong> (in separate columns) so you can compare the approaches.

Save and upload your file below.`,
    idealAnswer: `The file should contain:
(A) An XLOOKUP formula like =XLOOKUP(B3, Transactions!B:B, Transactions!C:C) that returns the Amount for each rep's ID.
(B) A VLOOKUP formula like =VLOOKUP(B3, Transactions!B:C, 2, FALSE) for comparison.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for XLOOKUP and VLOOKUP formulas in the Reps & Levels sheet.

- 5 (Expert): File contains both a correct XLOOKUP and a correct VLOOKUP formula referencing the Transactions sheet data appropriately.
- 4 (Proficient): File contains at least an XLOOKUP formula with correct structure.
- 3 (Competent): File contains one lookup formula but with minor errors (e.g., wrong column reference).
- 2 (Basic): File contains a lookup attempt but with significant errors.
- 1 (Novice): No lookup formulas found in the file.

SCORING DECISION TREE:
1. Does the file contain an XLOOKUP formula? → If NO, max Level 3.
2. If YES: Does it also contain a VLOOKUP for comparison? → If NO, score Level 4.
3. If YES (both formulas correct): Score Level 4.
4. Do both formulas correctly reference the Transactions sheet and return the right values? → Score Level 5.

ERROR HANDLING: If VLOOKUP uses TRUE (approximate match) instead of FALSE (exact match), flag this. Cap at Level 3 if the lookup returns wrong data.`,
    goalText: "Compare XLOOKUP and VLOOKUP side by side, then discuss limitations.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>VLOOKUP</em> and <em>XLOOKUP</em>',
      'Practice file: <a href="/exercise-files/VLOOKUP.xlsx" download class="text-[#0a66c2] hover:underline">VLOOKUP.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

You need to pull a Product Name and Price from Sheet2 into Sheet1 based on Product ID. Could you use <strong>VLOOKUP</strong> for this? Name one key <strong>limitation</strong> you'd need to watch out for.`,
      idealAnswer: `Yes, VLOOKUP works, but the lookup value (Product ID) must be in the leftmost column of the lookup range. Also, the column index number (e.g., 2 for Name) is fragile — if someone inserts a column, the index breaks.

Additional limitations: VLOOKUP defaults to approximate match (TRUE), so you must set the last argument to FALSE for exact match.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies the leftmost-column requirement AND the fragile column index problem. May also mention the approximate match default.
- 4 (Proficient): Identifies at least one key limitation with clear explanation.
- 3 (Competent): General awareness of VLOOKUP limitations but explanation is vague.
- 2 (Basic): Says VLOOKUP works but can't identify specific limitations.
- 1 (Novice): Cannot describe VLOOKUP's behavior.

SCORING DECISION TREE:
1. Does the response confirm VLOOKUP works AND identify at least one specific limitation? → If NO, max Level 3.
2. If YES: Are there errors (e.g., claiming VLOOKUP defaults to exact match)? → If YES, score Level 3.
3. If YES (correct) AND NO errors: Score Level 4.
4. Does it mention both the leftmost-column limitation AND the fragile column index issue? → Score Level 5.

ERROR HANDLING: If the response claims VLOOKUP defaults to exact match (it defaults to approximate/TRUE), flag this FIRST. Caps at Level 3.`
    }
  },

  excel_choosing_lookups: {
    id: 'excel_choosing_lookups',
    expectsFileUpload: true,
    uploadFileName: 'INDEX-MATCH.xlsx',
    initialQuestion: `Download <a href="/exercise-files/INDEX-MATCH.xlsx" download class="text-[#0a66c2] hover:underline">INDEX-MATCH.xlsx</a> and open it in Excel. On the <strong>Reps & Levels</strong> sheet, notice that <strong>Name</strong> is in column B but <strong>ID</strong> is in column D — the lookup value isn't in the leftmost column.

There's a lookup cell (near column F/G) with an ID like <strong>"CC-CT3TK2"</strong>.

<strong>Your goal:</strong> Write a formula that finds the <strong>Name</strong> (column B) of the rep with that ID (column D). Then try solving it a second way using VLOOKUP — what happens?

Save and upload your file below.`,
    idealAnswer: `The file should contain:
(A) An INDEX/MATCH formula like =INDEX(B:B, MATCH("CC-CT3TK2", D:D, 0)) that returns the rep's Name by looking up their ID in column D.
(B) A VLOOKUP attempt that demonstrates the left-lookup limitation — VLOOKUP can't return a value from column B when the lookup column is D.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for INDEX/MATCH and VLOOKUP formulas on the Reps & Levels sheet.

- 5 (Expert): File contains a correct INDEX/MATCH formula that successfully performs the left-lookup AND shows a VLOOKUP attempt demonstrating the limitation.
- 4 (Proficient): File contains a correct INDEX/MATCH formula with proper MATCH and INDEX references.
- 3 (Competent): File contains an INDEX/MATCH attempt but with minor errors (e.g., wrong match_type argument).
- 2 (Basic): File contains a lookup attempt but uses the wrong approach entirely.
- 1 (Novice): No INDEX/MATCH formula found in the file.

SCORING DECISION TREE:
1. Does the file contain an INDEX/MATCH formula? → If NO, max Level 3.
2. If YES: Is the MATCH using exact match (0) and referencing column D for ID? → If NO, score Level 3.
3. If YES (correct INDEX/MATCH): Score Level 4.
4. Does it also include a VLOOKUP attempt showing the left-lookup limitation? → Score Level 5.

ERROR HANDLING: If MATCH uses 1 or -1 instead of 0 (exact match), flag this — sorted data is not guaranteed. Cap at Level 3.`,
    goalText: "Practice INDEX/MATCH for a left-lookup, then compare lookup approaches.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>VLOOKUP and XLOOKUP comparison</em>, <em>INDEX/MATCH</em>, and <em>The INDEX/MATCH vs. VLOOKUP controversy</em>',
      'Practice file: <a href="/exercise-files/INDEX-MATCH.xlsx" download class="text-[#0a66c2] hover:underline">INDEX-MATCH.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

Your team is debating lookups. For each scenario, name the function you'd use and give one reason why:

<strong>Scenario A:</strong> Look up an employee's department where Employee ID is in column C (not the first column).
<strong>Scenario B:</strong> A flexible lookup in a workbook that must be compatible with <strong>Excel 2016</strong>.`,
      idealAnswer: `Scenario A: XLOOKUP (or INDEX/MATCH). VLOOKUP won't work because the lookup column (C) isn't leftmost. XLOOKUP lets you specify any column.

Scenario B: INDEX/MATCH. It's the best choice for Excel 2016 compatibility since XLOOKUP wasn't available until Office 365/2021.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies XLOOKUP or INDEX/MATCH for Scenario A (with leftmost-column reasoning) AND INDEX/MATCH for Scenario B (with compatibility reasoning).
- 4 (Proficient): Correct function choices for both scenarios with reasonable explanations.
- 3 (Competent): Correct for 1 scenario or correct for both but with weak reasoning.
- 2 (Basic): Gives answers without clear reasoning or suggests VLOOKUP for Scenario A.
- 1 (Novice): Incorrect function choices.

SCORING DECISION TREE:
1. Does the response identify correct functions for both scenarios with reasoning? → If NO, max Level 3.
2. If YES: Does the response incorrectly claim XLOOKUP works in Excel 2016? → If YES, score Level 3 and flag.
3. If YES (both correct) AND NO errors: Score Level 4.
4. Does it explain why VLOOKUP fails for Scenario A AND why XLOOKUP isn't available for Scenario B? → Score Level 5.

ERROR HANDLING: If the response claims XLOOKUP is available in Excel 2016, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_ch3_wrapup: {
    id: 'excel_ch3_wrapup',
    expectsFileUpload: true,
    uploadFileName: '2Way-lookup.xlsx',
    initialQuestion: `Download <a href="/exercise-files/2Way-lookup.xlsx" download class="text-[#0a66c2] hover:underline">2Way-lookup.xlsx</a> and open it in Excel. You'll see an <strong>ORDER</strong> section (with Item and QTY) and a <strong>PRICE GRID</strong> (with items on rows and quantity tiers on columns).

<strong>Your goal:</strong> In the <strong>Cost</strong> column of the ORDER section, write a formula that looks up the correct price for each order — it needs to match both the <strong>Item name</strong> against the PRICE GRID rows AND the <strong>QTY</strong> against the quantity tier columns. This is a two-dimensional lookup.

Save and upload your file below.`,
    idealAnswer: `The file should contain an INDEX/MATCH/MATCH or nested XLOOKUP formula in the Cost column that performs a two-way lookup — matching the Item name against PRICE GRID rows AND the QTY against quantity tier columns. Expected formula structure: =INDEX(PriceGrid, MATCH(Item, ItemColumn, 0), MATCH(QTY, TierHeaders, 0)) or =XLOOKUP(Item, ItemColumn, XLOOKUP(QTY, TierHeaders, DataRows)).`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a two-way lookup formula (INDEX/MATCH/MATCH or nested XLOOKUP) in the Cost column.

- 5 (Expert): File contains a correct two-way lookup formula with both row matching (Item) and column matching (QTY) working correctly.
- 4 (Proficient): File contains a two-way lookup formula with correct structure.
- 3 (Competent): File contains a lookup attempt but only matches one dimension (row or column, not both).
- 2 (Basic): File contains a simple VLOOKUP that doesn't handle the two-way nature.
- 1 (Novice): No lookup formula found in the Cost column.

SCORING DECISION TREE:
1. Does the file contain a two-way lookup formula? → If NO, max Level 3.
2. If YES: Does it match both row (Item) and column (QTY)? → If NO, score Level 3.
3. If YES (both dimensions matched): Score Level 4.
4. Does the formula return correct prices for the orders? → Score Level 5.

ERROR HANDLING: If a single VLOOKUP is used without acknowledging the column-matching challenge, flag this. Cap at Level 3.`,
    goalText: "Build a two-way lookup, then discuss INDIRECT and pricing strategy.<br>This Skill Builder has 3 parts.",
    durationText: "4-5 minutes",
    prepareItems: [
      'Finish watching all Chapter 3 videos',
      'Practice file: <a href="/exercise-files/2Way-lookup.xlsx" download class="text-[#0a66c2] hover:underline">2Way-lookup.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

You're building a pricing calculator. You need to pull <strong>Product Name</strong> and <strong>Base Price</strong> from a Products sheet into a Calculator sheet using Product ID. Which lookup function would you use and why?`,
      idealAnswer: `XLOOKUP — look up the Product ID and return Product Name or Base Price directly. It's preferred because it defaults to exact match, has no fragile column index numbers, and the syntax is clean.

VLOOKUP would also work since Product ID is likely in the first column, but XLOOKUP is more maintainable.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies XLOOKUP (or VLOOKUP) with clear reasoning about why it's appropriate, including advantages like no column index.
- 4 (Proficient): Identifies an appropriate lookup function with reasonable explanation.
- 3 (Competent): Names a lookup function but explanation is vague.
- 2 (Basic): Mentions lookups without connecting to the task.
- 1 (Novice): Cannot identify which lookup function to use.

SCORING DECISION TREE:
1. Does the response identify an appropriate lookup function? → If NO, max Level 3.
2. If YES: Are there errors? → If YES, score Level 3.
3. If YES (correct function) AND NO errors: Score Level 4.
4. Does it explain why XLOOKUP is preferred over VLOOKUP? → Score Level 5.

ERROR HANDLING: If the response overcomplicates with INDEX/MATCH/MATCH for a simple single-criterion lookup, note the simpler approach. Cap at Level 3 only if incorrect.`
    },
    part3: {
      question: `Now for Part 3:

A junior analyst asks: <em>"I heard INDIRECT is really powerful. Should I use it to make sheet references dynamic in our pricing calculator?"</em>

In 2-3 sentences, advise them on when INDIRECT is useful and what caution you'd give.`,
      idealAnswer: `INDIRECT converts a text string into a cell reference — useful for dynamically referencing different sheets based on user input.

Caution: It's volatile (recalculates on every change, slowing large workbooks) and breaks if a referenced sheet is renamed. For a shared calculator, XLOOKUP or data validation would be safer.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly explains INDIRECT (text to reference), gives a use case, AND identifies both cautions (volatile AND fragility with renamed sheets).
- 4 (Proficient): Explains INDIRECT's purpose and gives at least one meaningful caution.
- 3 (Competent): General awareness of INDIRECT but misses key cautions.
- 2 (Basic): Vague answer without specific cautions.
- 1 (Novice): Cannot explain INDIRECT's purpose.

SCORING DECISION TREE:
1. Does the response explain INDIRECT's purpose AND give at least one caution? → If NO, max Level 3.
2. If YES: Are there errors? → If YES, score Level 3.
3. If YES (purpose + caution) AND NO errors: Score Level 4.
4. Does it identify both cautions (volatile AND fragility) and suggest a safer alternative? → Score Level 5.

ERROR HANDLING: If the response claims INDIRECT is not volatile or survives sheet renaming, flag this. Caps at Level 3.`
    }
  },

  excel_formula_strategy: {
    id: 'excel_formula_strategy',
    expectsFileUpload: true,
    uploadFileName: 'Formula-vs-Lookup-Array.xlsx',
    initialQuestion: `Download <a href="/exercise-files/Formula-vs-Lookup-Array.xlsx" download class="text-[#0a66c2] hover:underline">Formula-vs-Lookup-Array.xlsx</a> and open it in Excel. Look at the <strong>Units</strong> sheet — column E uses a nested IF formula to assign a "Layer" label based on the <strong>Floor</strong> value (column D), while column F achieves the same result using a lookup approach referencing the <strong>Lookup Range</strong> sheet.

<strong>Your goal:</strong> The lookup formula in column F currently shows <strong>#N/A</strong> if a floor value isn't found. Add error handling so it displays a friendly message (like "Floor not found") instead of the error — but make sure you only catch lookup-specific errors, not other formula errors.

Save and upload your file below.`,
    idealAnswer: `The file should show the lookup formula in column F wrapped with IFNA error handling, e.g., =IFNA(existing_lookup_formula, "Floor not found"). This catches #N/A errors when a floor value doesn't match any threshold in the Lookup Range sheet.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for IFNA wrapping around the lookup formula in the "Layer (Look-up)" column (F) on the Units sheet.

- 5 (Expert): File shows the lookup formula in column F wrapped with IFNA, providing a meaningful fallback value (e.g., "Floor not found" or "N/A").
- 4 (Proficient): File shows IFNA (or IFERROR) wrapping the lookup formula.
- 3 (Competent): File shows an error-handling attempt but it's incorrectly applied or uses IFERROR where IFNA would be more appropriate.
- 2 (Basic): File shows the lookup formula unchanged with no error handling added.
- 1 (Novice): No changes found in the file.

SCORING DECISION TREE:
1. Does the file contain IFNA wrapping the lookup formula in column F? → If NO, max Level 3.
2. If YES: Does it provide a meaningful fallback value? → If NO, score Level 3.
3. If YES (IFNA with fallback): Score Level 4.
4. Does it use IFNA specifically (not IFERROR), preserving visibility of other error types? → Score Level 5.

ERROR HANDLING: If IFERROR is used instead of IFNA, note that IFNA is preferred because it only catches #N/A without masking other errors. Cap at Level 4.`,
    goalText: "Compare formula vs. lookup approaches and add error handling.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Use Alt+Enter to make formulas more readable</em>, <em>Formula vs. lookup table</em>, and <em>Formula vs. helper columns</em>',
      'Practice file: <a href="/exercise-files/Formula-vs-Lookup-Array.xlsx" download class="text-[#0a66c2] hover:underline">Formula-vs-Lookup-Array.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

Look at this formula a coworker wrote:

<strong>=IF(AND(VLOOKUP(A2,Sheet2!A:D,3,FALSE)="Active",VLOOKUP(A2,Sheet2!A:D,4,FALSE)>50000),VLOOKUP(A2,Sheet2!A:D,4,FALSE)*0.1,IF(VLOOKUP(A2,Sheet2!A:D,4,FALSE)>30000,VLOOKUP(A2,Sheet2!A:D,4,FALSE)*0.05,0))</strong>

Identify the <strong>biggest problem</strong> with this formula and briefly describe your fix.`,
      idealAnswer: `The biggest problem: the same VLOOKUP appears 4 times — each recalculates separately, wasting processing time and making the formula hard to read.

Fix: Use LET to store each VLOOKUP result once and reuse it. This makes the formula faster and more readable.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies repeated VLOOKUPs as the biggest problem, explains the performance impact, AND provides a specific fix using LET or helper columns.
- 4 (Proficient): Identifies repeated VLOOKUPs as the main problem with a reasonable fix.
- 3 (Competent): Identifies a real problem but not the biggest one, or identifies it without a fix.
- 2 (Basic): Says "it's hard to read" without identifying the repeated-VLOOKUP issue.
- 1 (Novice): Cannot identify issues with the formula.

SCORING DECISION TREE:
1. Does the response identify the repeated VLOOKUP calls as the biggest problem? → If NO, max Level 3.
2. If YES: Does it provide a specific fix (LET or helper columns)? → If NO, max Level 4.
3. If YES (problem + fix) AND NO errors: Score Level 4.
4. Does it show a LET structure or helper column approach with performance explanation? → Score Level 5.

ERROR HANDLING: If the response claims repeating VLOOKUPs is fine, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_formula_design: {
    id: 'excel_formula_design',
    expectsFileUpload: true,
    uploadFileName: 'Formula-vs-Lookup-Array.xlsx',
    initialQuestion: `Download <a href="/exercise-files/Formula-vs-Lookup-Array.xlsx" download class="text-[#0a66c2] hover:underline">Formula-vs-Lookup-Array.xlsx</a> and open it in Excel. The <strong>Lookup Range</strong> sheet maps Floor values to Layer labels: 0→"No!", 5→"Too Low", 10→"😍", 21→"Too High".

<strong>Your goal:</strong> On the <strong>Units</strong> sheet, in an empty column, write a single formula that assigns a <strong>Layer label</strong> based on the <strong>Floor</strong> value in column D — using at least 3 of the tiers from the Lookup Range sheet. The formula should use conditional logic (not a lookup approach).

Save and upload your file below.`,
    idealAnswer: `The file should contain a nested IF formula in a new column on the Units sheet that assigns Layer labels based on Floor values. Expected formula: =IF(D2<5, "No!", IF(D2<10, "Too Low", IF(D2<21, "😍", "Too High"))). Conditions should go from most to least restrictive.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a nested IF formula in a new column on the Units sheet.

- 5 (Expert): File contains a correct nested IF formula with at least 3 tiers, conditions ordered from most to least restrictive, producing correct Layer labels.
- 4 (Proficient): File contains a nested IF formula with correct structure and at least 3 tiers.
- 3 (Competent): File contains a nested IF attempt but with ordering issues or missing tiers.
- 2 (Basic): File contains a simple IF (not nested) or incorrect formula.
- 1 (Novice): No IF formula found in a new column.

SCORING DECISION TREE:
1. Does the file contain a nested IF formula with at least 3 tiers? → If NO, max Level 3.
2. If YES: Are conditions ordered correctly (most restrictive first)? → If NO, score Level 3.
3. If YES (correct nesting and order): Score Level 4.
4. Does it produce correct labels matching the Lookup Range thresholds? → Score Level 5.

ERROR HANDLING: If conditions are ordered least-to-most restrictive (e.g., checking <30 before <5), flag this — it produces wrong results. Cap at Level 3.`,
    goalText: "Build a nested IF formula step by step, then discuss formula design principles.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Build complex formulas in steps</em>, <em>Writing formulas for "future you"</em>, and <em>Compatibility functions</em>'
    ],
    part2: {
      question: `Now for Part 2:

You need to build a formula that assigns performance ratings based on Sales (column B) and Satisfaction (column C):
• "Star Performer" — Sales ≥ $100K AND satisfaction ≥ 8
• "Strong" — Sales ≥ $75K AND satisfaction ≥ 6
• "Developing" — Sales ≥ $50K
• "Needs Improvement" — Everything else

Describe your <strong>step-by-step approach</strong> to building this formula (not the final formula itself).`,
      idealAnswer: `Start with the simplest case — an IF for "Star Performer" returning that or "not yet." Test it. Then replace "not yet" with the next IF for "Strong." Continue nesting until all conditions are covered.

Key: conditions must go most-to-least restrictive. Checking "Developing" first would catch Star Performers too. Add Alt+Enter line breaks or LET for readability.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Describes an incremental build process (start simple, test, add layers), addresses condition ordering (most restrictive first), AND mentions readability (Alt+Enter or LET).
- 4 (Proficient): Describes a reasonable build process with incremental testing.
- 3 (Competent): Describes a general approach but misses condition ordering or testing.
- 2 (Basic): Jumps to the final formula without describing a process.
- 1 (Novice): Cannot describe how to approach building the formula.

SCORING DECISION TREE:
1. Does the response describe an incremental build process? → If NO, max Level 3.
2. If YES: Does it address condition ordering (most restrictive first)? → If NO, max Level 4.
3. If YES (incremental + ordering) AND NO errors: Score Level 4.
4. Does it emphasize testing at each step AND mention readability? → Score Level 5.

ERROR HANDLING: If conditions are ordered least-to-most restrictive, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_ch4_wrapup: {
    id: 'excel_ch4_wrapup',
    expectsFileUpload: true,
    uploadFileName: 'LET.xlsx',
    initialQuestion: `Your manager asks you to total each employee's hours across 12 separate month sheets (Jan, Feb, Mar… Dec), all structured identically with hours in cell <strong>D5</strong>.

Download <a href="/exercise-files/LET.xlsx" download class="text-[#0a66c2] hover:underline">LET.xlsx</a> and open it in Excel.

<strong>Your goal:</strong> In an empty cell, write a <strong>single formula</strong> that sums cell D5 across all 12 month sheets at once — without listing each sheet individually.

Save and upload your file below.`,
    idealAnswer: `The file should contain a 3D SUM formula like =SUM(Jan:Dec!D5) that sums cell D5 across all sheets from Jan through Dec. The colon between sheet names means "all sheets from Jan to Dec inclusive."`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a 3D SUM formula referencing multiple sheets.

- 5 (Expert): File contains a correct 3D formula with SheetStart:SheetEnd!Cell syntax (e.g., =SUM(Jan:Dec!D5)).
- 4 (Proficient): File contains a 3D formula with correct structure.
- 3 (Competent): File contains a SUM formula but without proper 3D sheet referencing (e.g., summing individual sheet references instead of using the colon range).
- 2 (Basic): File contains a SUM formula that only references one sheet.
- 1 (Novice): No 3D formula found.

SCORING DECISION TREE:
1. Does the file contain a 3D formula using SheetStart:SheetEnd! syntax? → If NO, max Level 3.
2. If YES: Does it reference the correct cell (D5) across the right sheets? → If NO, score Level 3.
3. If YES (correct 3D formula): Score Level 4.
4. Does the formula use the concise colon syntax rather than individual sheet references? → Score Level 5.

ERROR HANDLING: If individual sheet references are used (=SUM(Jan!D5, Feb!D5, ...)) instead of the 3D range, note that the colon syntax is more efficient. Cap at Level 3.`,
    goalText: "Apply 3D formulas, LET function, and error handling.<br>This Skill Builder has 3 parts.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching all Chapter 4 videos, especially <em>LET function overview</em> and <em>Error handling: IFNA and IFERROR</em>',
      'Practice file: <a href="/exercise-files/LET.xlsx" download class="text-[#0a66c2] hover:underline">LET.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

A formula uses 3 repeated VLOOKUPs (same lookup) and has no error handling. A colleague complains it's slow and shows #N/A for new hires.

Describe how you'd use the <strong>LET function</strong> to eliminate the repeated lookups. What variables would you define?`,
      idealAnswer: `Use LET to store each VLOOKUP once as a named variable (e.g., emp_dept, emp_salary), then reuse them in the calculation. Each lookup runs once instead of 3 times.

This improves both performance (fewer lookups) and readability (descriptive variable names instead of repeated formulas).`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Describes a clear LET structure with named variables for lookups and explains both performance and readability benefits.
- 4 (Proficient): Describes a reasonable LET structure that eliminates repeated lookups.
- 3 (Competent): Describes using LET but structure is incomplete.
- 2 (Basic): Mentions LET but can't describe how to structure it.
- 1 (Novice): Cannot describe how LET works.

SCORING DECISION TREE:
1. Does the response describe a LET structure that eliminates repeated lookups? → If NO, max Level 3.
2. If YES: Are there errors about how LET works? → If YES, score Level 3.
3. If YES (correct LET structure) AND NO errors: Score Level 4.
4. Does it name variables, explain performance benefits, AND show logical flow? → Score Level 5.

ERROR HANDLING: If the response claims LET can't use XLOOKUP or VLOOKUP inside it, flag this. Caps at Level 3.`
    },
    part3: {
      question: `Now for Part 3:

The formula still shows <strong>#N/A</strong> for new hires not yet in the lookup table. Which error-handling function would you add, and why is it the right choice over the alternative?`,
      idealAnswer: `IFNA — it specifically catches #N/A errors from lookup failures without masking other errors like #REF! or #VALUE! that might indicate real bugs.

IFERROR catches ALL errors, which can hide formula problems. IFNA is safer because you only handle the expected "not found" case.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies IFNA AND explains why it's preferred over IFERROR (only catches #N/A, doesn't mask other errors).
- 4 (Proficient): Identifies IFNA or IFERROR with reasonable explanation.
- 3 (Competent): Mentions error handling but doesn't distinguish IFNA from IFERROR.
- 2 (Basic): Vague awareness of error handling.
- 1 (Novice): Cannot describe error handling for lookups.

SCORING DECISION TREE:
1. Does the response identify IFNA (or IFERROR)? → If NO, max Level 3.
2. If YES: Does it explain why IFNA is preferred? → If NO, max Level 4.
3. If YES (IFNA with reasoning) AND NO errors: Score Level 4.
4. Does it explain the IFNA vs IFERROR distinction clearly? → Score Level 5.

ERROR HANDLING: If IFERROR is called always better than IFNA, flag this. Caps at Level 3 only if significant.`
    }
  },

  excel_midterm: {
    id: 'excel_midterm',
    expectsFileUpload: true,
    uploadFileName: 'Mid-Challenge-Course-Completions.xlsx',
    initialQuestion: `Midterm check-in! Time to combine what you've learned.

Download <a href="/exercise-files/Mid-Challenge-Course-Completions.xlsx" download class="text-[#0a66c2] hover:underline">Mid-Challenge-Course-Completions.xlsx</a> and open it in Excel. You'll see a <strong>Reps</strong> sheet with columns: Rep name, Course1, Course2, and Course3 (each containing completion dates — or blank if not completed).

<strong>Your goal:</strong> Add formulas to answer these two questions:
<strong>(1)</strong> How many reps completed <strong>both</strong> Course1 and Course2? (A rep has completed a course if the cell contains a date, not blank.)
<strong>(2)</strong> What is <strong>Seth's</strong> Course3 completion date? (Look it up by name.)

Save and upload your file below.`,
    idealAnswer: `The file should contain:
(1) A COUNTIFS formula like =COUNTIFS(C:C, "<>", D:D, "<>") that counts reps where both Course1 and Course2 have date values (are not blank).
(2) An XLOOKUP formula like =XLOOKUP("Seth", B:B, E:E) that returns Seth's Course3 completion date.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for COUNTIFS and XLOOKUP formulas on the Reps sheet.

- 5 (Expert): File contains both a correct COUNTIFS formula using "<>" for non-blank checks on Course1 and Course2, AND a correct XLOOKUP for "Seth" returning Course3.
- 4 (Proficient): File contains both formulas with correct structure.
- 3 (Competent): File contains one of the two formulas correctly, or both with minor issues.
- 2 (Basic): File contains a formula attempt but with significant errors.
- 1 (Novice): No COUNTIFS or XLOOKUP formulas found.

SCORING DECISION TREE:
1. Does the file contain both a COUNTIFS and an XLOOKUP formula? → If NO, max Level 3.
2. If YES: Does COUNTIFS use "<>" for non-blank checks on columns C and D? → If NO, score Level 3.
3. If YES (both correct): Score Level 4.
4. Do both formulas reference the correct columns (C/D for COUNTIFS, B/E for XLOOKUP) and return accurate results? → Score Level 5.

ERROR HANDLING: If COUNTIF (singular) is used instead of COUNTIFS for checking two columns, flag this. Cap at Level 3.`,
    goalText: "Mid-course skills check: combine conditional functions and lookups.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching all Challenge videos in Chapter 5',
      'Practice file: <a href="/exercise-files/Mid-Challenge-Course-Completions.xlsx" download class="text-[#0a66c2] hover:underline">Mid-Challenge-Course-Completions.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

A music store tracks guitar inventory. Your boss asks: <em>"How many Fender guitars priced over $500 are in our Downtown location?"</em>

Which function gives you the <strong>count</strong>? Describe the key arguments (not full syntax — just the 3 criteria pairs).`,
      idealAnswer: `COUNTIFS — counts cells matching multiple criteria. Key arguments: Brand column + "Fender", Price column + ">500", Location column + "Downtown".

Three paired criteria ranges and values. COUNTIFS (not COUNTIF) is essential because all three conditions must be met simultaneously.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies COUNTIFS (not COUNTIF) with all 3 criteria pairs described accurately, AND explains why COUNTIFS is needed.
- 4 (Proficient): Identifies COUNTIFS with the 3 criteria described reasonably.
- 3 (Competent): Identifies COUNTIFS but criteria description is incomplete or uses COUNTIF.
- 2 (Basic): Mentions a counting function but can't connect it to multiple criteria.
- 1 (Novice): Cannot identify the appropriate function.

SCORING DECISION TREE:
1. Does the response correctly identify COUNTIFS with the key criteria? → If NO, max Level 3.
2. If YES: Are there errors (e.g., using COUNTIF singular)? → If YES, score Level 3 and flag.
3. If YES (COUNTIFS with criteria) AND NO errors: Score Level 4.
4. Does it describe all 3 criteria pairs accurately AND explain why COUNTIFS (plural) is needed? → Score Level 5.

ERROR HANDLING: If COUNTIF (singular) is used for multiple criteria, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_datetime: {
    id: 'excel_datetime',
    expectsFileUpload: true,
    uploadFileName: 'TIMES.xlsx',
    initialQuestion: `Employees log their hours as time values like <strong>"8:30"</strong> (8 hours 30 minutes). The payroll system needs <strong>decimal hours</strong> (8.5) instead.

Download <a href="/exercise-files/TIMES.xlsx" download class="text-[#0a66c2] hover:underline">TIMES.xlsx</a> and open it in Excel.

<strong>Your goal:</strong> Add a formula that converts a time value into its <strong>decimal hours</strong> equivalent (e.g., 8:30 → 8.5). The result should display as a plain number, not a time format.

Save and upload your file below.`,
    idealAnswer: `The file should contain a formula that multiplies a time cell by 24 (e.g., =A1*24) to convert time to decimal hours. The result cell should be formatted as Number (not Time) to display 8.5 instead of a time format.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a formula that converts time values to decimal hours using *24.

- 5 (Expert): File contains a formula multiplying a time cell by 24, with the result cell formatted as Number showing the correct decimal value.
- 4 (Proficient): File contains a *24 conversion formula with correct output.
- 3 (Competent): File contains a time conversion attempt but uses HOUR()/MINUTE() separately instead of *24, or result is still formatted as Time.
- 2 (Basic): File contains a formula attempt but it doesn't correctly convert time to decimal.
- 1 (Novice): No time conversion formula found.

SCORING DECISION TREE:
1. Does the file contain a *24 conversion formula? → If NO, max Level 3.
2. If YES: Is the result formatted as Number (not Time)? → If NO, score Level 3.
3. If YES (*24 + Number format): Score Level 4.
4. Does the formula produce the correct decimal value (e.g., 8.5 for 8:30)? → Score Level 5.

ERROR HANDLING: If HOUR()+MINUTE()/60 is used instead of *24, note it works but *24 is simpler. Cap at Level 4 if approach is correct but less elegant.`,
    goalText: "Convert time to decimal hours, then apply date functions.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>Time, rounding, and converting to decimals</em>, <em>EOMONTH</em>, and <em>YEARFRAC</em>',
      'Practice file: <a href="/exercise-files/TIMES.xlsx" download class="text-[#0a66c2] hover:underline">TIMES.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

You're building a project tracker. Your boss needs:
<strong>(1)</strong> The last day of the month for each project's start date (billing cutoff). Which function?
<strong>(2)</strong> The fraction of the year between the start date and today (for prorated costs). Which function?`,
      idealAnswer: `(1) EOMONTH — returns the last day of a month. =EOMONTH(StartDate, 0) for the same month. The second argument is the month offset.

(2) YEARFRAC — returns the fraction of a year between two dates. =YEARFRAC(StartDate, TODAY()) returns a decimal like 0.25 for 3 months.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies EOMONTH with the offset parameter AND YEARFRAC with proration use case. May mention day-count basis.
- 4 (Proficient): Correctly identifies both functions with reasonable explanations.
- 3 (Competent): Identifies 1 of 2 functions correctly.
- 2 (Basic): Vague awareness of date functions without specifics.
- 1 (Novice): Cannot identify date functions.

SCORING DECISION TREE:
1. Does the response correctly identify both EOMONTH and YEARFRAC? → If NO, max Level 3.
2. If YES: Are there errors (e.g., wrong EOMONTH offset usage)? → If YES, score Level 3.
3. If YES (both correct) AND NO errors: Score Level 4.
4. Does it explain the offset parameter AND how YEARFRAC is used for proration? → Score Level 5.

ERROR HANDLING: If EOMONTH is confused with EDATE, flag this. Caps at Level 3 if the function is wrong.`
    }
  },

  excel_text_functions: {
    id: 'excel_text_functions',
    expectsFileUpload: true,
    uploadFileName: 'TEXTJOIN.xlsx',
    initialQuestion: `Download <a href="/exercise-files/TEXTJOIN.xlsx" download class="text-[#0a66c2] hover:underline">TEXTJOIN.xlsx</a> and open it in Excel. The <strong>Names</strong> sheet has columns for Des. (title), Last Name, First Name, and M.I. (middle initial). The <strong>Full Name</strong> column (F) is empty.

<strong>Your goal:</strong> In the Full Name column, write a single formula that combines the name components into a complete name like <strong>"Dr. Maxine Moon"</strong> — separated by spaces. Important: some rows are missing a title or middle initial. Your formula should handle those gracefully without producing extra spaces.

Save and upload your file below.`,
    idealAnswer: `The file should contain a TEXTJOIN formula in the Full Name column (F) like =TEXTJOIN(" ", TRUE, B2, D2, C2, E2) that combines Des., First Name, Last Name, and M.I. with spaces. The TRUE argument should skip empty cells so rows without a title or middle initial don't get extra spaces.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a TEXTJOIN formula in the Full Name column (F) on the Names sheet.

- 5 (Expert): File contains a correct TEXTJOIN formula with " " delimiter, TRUE for ignore_empty, and references to the correct columns (Des., First Name, Last Name, M.I.) producing clean full names like "Dr. Maxine Moon".
- 4 (Proficient): File contains a TEXTJOIN formula with correct structure and ignore_empty set to TRUE.
- 3 (Competent): File contains a TEXTJOIN attempt but with FALSE for ignore_empty (causing extra spaces), or uses concatenation instead.
- 2 (Basic): File contains a formula attempt but it's not TEXTJOIN or doesn't combine the right columns.
- 1 (Novice): No formula found in the Full Name column.

SCORING DECISION TREE:
1. Does the file contain a TEXTJOIN formula in column F? → If NO, max Level 3.
2. If YES: Is ignore_empty set to TRUE? → If NO, score Level 3 (extra spaces will appear).
3. If YES (TEXTJOIN with TRUE): Score Level 4.
4. Does it reference the correct columns in the right order and produce clean names? → Score Level 5.

ERROR HANDLING: If concatenation (& operator) is used instead of TEXTJOIN, note that it won't handle missing values gracefully. Cap at Level 3.`,
    goalText: "Combine text data with TEXTJOIN, then extract messy text with functions.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>LEFT, RIGHT, and MID</em>, <em>UPPER, LOWER, and PROPER</em>, and <em>TEXTJOIN</em>',
      'Practice file: <a href="/exercise-files/TEXTJOIN.xlsx" download class="text-[#0a66c2] hover:underline">TEXTJOIN.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

You received a data dump with messy employee records like:
<strong>"SMITH, john A. | Engineering | ID:EMP-4521"</strong>

Extract just the <strong>last name</strong> ("SMITH") and convert it to <strong>proper case</strong> ("Smith"). Name the function(s) and briefly describe your approach.`,
      idealAnswer: `Use LEFT+FIND to grab text before the comma: =LEFT(A1, FIND(",", A1)-1) gives "SMITH". Then wrap in PROPER: =PROPER(LEFT(A1, FIND(",", A1)-1)) gives "Smith".

Modern alternative: =PROPER(TEXTBEFORE(A1, ",")) — cleaner and more readable.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly uses LEFT+FIND (or TEXTBEFORE) for extraction AND PROPER for case conversion. May mention both classic and modern approaches.
- 4 (Proficient): Correctly describes the extraction and case conversion with appropriate functions.
- 3 (Competent): Identifies the right functions but approach is unclear.
- 2 (Basic): Names functions without explaining how to use them together.
- 1 (Novice): Cannot identify text extraction functions.

SCORING DECISION TREE:
1. Does the response correctly extract the last name AND convert to proper case? → If NO, max Level 3.
2. If YES: Are there errors (e.g., using RIGHT instead of LEFT)? → If YES, score Level 3.
3. If YES (correct approach) AND NO errors: Score Level 4.
4. Does it show both classic (LEFT/FIND) and modern (TEXTBEFORE) approaches? → Score Level 5.

ERROR HANDLING: If LEFT and RIGHT are confused, flag this FIRST. Caps at Level 3.`
    }
  },

  excel_dynamic_arrays_practice: {
    id: 'excel_dynamic_arrays_practice',
    expectsFileUpload: true,
    uploadFileName: 'FILTER.xlsx',
    initialQuestion: `You manage a vacation packages catalog with columns: Vacation Package, Destination, Days, and International (marked "x" or blank).

Download <a href="/exercise-files/FILTER.xlsx" download class="text-[#0a66c2] hover:underline">FILTER.xlsx</a> and open it in Excel.

<strong>Your goal:</strong> In an empty area, write a single formula that shows only <strong>international Desert</strong> vacations — where Destination (column C) is <strong>"Desert"</strong> AND International (column E) is <strong>"x"</strong>. Both conditions must be met, and the results should update automatically if data changes.

Save and upload your file below.`,
    idealAnswer: `The file should contain a FILTER formula like =FILTER(B1:E28, (C1:C28="Desert")*(E1:E28="x")) that shows only Desert international vacations. Multiplication (*) acts as AND logic — both conditions must be true for a row to be included.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a FILTER formula with multi-criteria AND logic using multiplication.

- 5 (Expert): File contains a correct FILTER formula using multiplication (*) for AND logic, filtering for Destination="Desert" AND International="x", with results spilling correctly.
- 4 (Proficient): File contains a FILTER formula with correct structure and both criteria.
- 3 (Competent): File contains a FILTER attempt but uses AND() function (which doesn't work in FILTER) or only applies one criterion.
- 2 (Basic): File contains a formula attempt but it's not FILTER or doesn't filter correctly.
- 1 (Novice): No FILTER formula found.

SCORING DECISION TREE:
1. Does the file contain a FILTER formula with multiplication for AND logic? → If NO, max Level 3.
2. If YES: Does it filter for both Destination="Desert" AND International="x"? → If NO, score Level 3.
3. If YES (both criteria correct): Score Level 4.
4. Do the results spill correctly showing only matching rows? → Score Level 5.

ERROR HANDLING: If AND() is used inside FILTER, flag this — AND() returns a single value, not an array. Use multiplication. Cap at Level 3.`,
    goalText: "Apply FILTER and other dynamic array functions to build a dynamic dashboard.<br>This Skill Builder has a Part 1 and Part 2.",
    durationText: "2-3 minutes",
    prepareItems: [
      'Finish watching <em>FILTER</em>, <em>UNIQUE</em>, and <em>TOCOL</em>',
      'Practice file: <a href="/exercise-files/FILTER.xlsx" download class="text-[#0a66c2] hover:underline">FILTER.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Great FILTER work! Now for Part 2:

Your manager also wants:
<strong>(1)</strong> A <strong>unique list</strong> of all Destinations (no duplicates).
<strong>(2)</strong> Take a two-column result (Vacation Package and Destination) and reshape it into a <strong>single column</strong>.

Which dynamic array functions would you use for each?`,
      idealAnswer: `(1) UNIQUE — returns unique values: =UNIQUE(C2:C28). It spills a deduplicated list of Destinations automatically. Can also use UNIQUE with the by_column and exactly_once arguments for more control.

(2) TOCOL — converts a multi-column range into a single column: =TOCOL(two_column_range). Useful for reshaping data. TOCOL reads left-to-right, top-to-bottom by default. You can also use the ignore argument to skip blanks or errors.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies UNIQUE for deduplication AND TOCOL for reshaping, with descriptions of how each works and mention of spilling behavior.
- 4 (Proficient): Correctly identifies both functions with reasonable descriptions.
- 3 (Competent): Identifies 1 of 2 functions correctly or both with some gaps.
- 2 (Basic): Identifies 1 function vaguely.
- 1 (Novice): Cannot identify the functions.

SCORING DECISION TREE:
1. Does the response correctly identify UNIQUE and TOCOL? → If NO, max Level 3.
2. If YES: Are there errors in how the functions work? → If YES, score Level 3.
3. If YES (both correct) AND NO errors: Score Level 4.
4. Does it describe spilling behavior and mention additional arguments/options for either function? → Score Level 5.

ERROR HANDLING: If the response confuses TOCOL with TOROW, note the difference (TOCOL = single column, TOROW = single row). Cap at Level 3 only if the function is wrong.`
    }
  },

  excel_ch7_wrapup: {
    id: 'excel_ch7_wrapup',
    expectsFileUpload: true,
    uploadFileName: 'TEXTBEFORE-TEXTAFTER.xlsx',
    initialQuestion: `Download <a href="/exercise-files/TEXTBEFORE-TEXTAFTER.xlsx" download class="text-[#0a66c2] hover:underline">TEXTBEFORE-TEXTAFTER.xlsx</a> and open it in Excel. The <strong>Data</strong> sheet has column B with tab-separated strings like <strong>"F036  Local  Healthcare  Rent  Orange  TJ  Libra"</strong>. The <strong>Profession</strong> column (C) is empty.

<strong>Your goal:</strong> In column C, write a formula that extracts just the <strong>Profession</strong> (the 3rd field — e.g., "Healthcare") from each combined string. The fields are separated by tab characters — in Excel, a tab is represented by <strong>CHAR(9)</strong>.

Save and upload your file below.`,
    idealAnswer: `The file should contain a formula in column C like =TEXTBEFORE(TEXTAFTER(B2, CHAR(9), 2), CHAR(9)) that extracts the 3rd tab-separated field ("Healthcare") from the combined string in column B. TEXTAFTER with argument "2" skips past the first 2 tabs, then TEXTBEFORE grabs text before the next tab.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for a TEXTAFTER/TEXTBEFORE formula in the Profession column (C) on the Data sheet.

- 5 (Expert): File contains a correct formula using TEXTAFTER with instance_num=2 and TEXTBEFORE with CHAR(9) that extracts "Healthcare" (or equivalent 3rd field) correctly.
- 4 (Proficient): File contains a TEXTAFTER/TEXTBEFORE formula with correct structure.
- 3 (Competent): File contains a text extraction attempt but with wrong instance number or missing CHAR(9).
- 2 (Basic): File contains a formula attempt that doesn't correctly extract the 3rd field.
- 1 (Novice): No formula found in the Profession column.

SCORING DECISION TREE:
1. Does the file contain a TEXTAFTER/TEXTBEFORE formula using CHAR(9) for tab separation? → If NO, max Level 3.
2. If YES: Does TEXTAFTER use instance_num=2 to skip past the first 2 tabs? → If NO, score Level 3.
3. If YES (correct formula): Score Level 4.
4. Does the formula correctly extract the Profession field for multiple rows? → Score Level 5.

ERROR HANDLING: If the formula uses a space or comma instead of CHAR(9) for tab delimiter, flag this. Cap at Level 3.`,
    goalText: "Extract text from tab-separated data, then apply dynamic array functions.<br>This Skill Builder has 3 parts.",
    durationText: "3-4 minutes",
    prepareItems: [
      'Finish watching all Chapter 7 videos',
      'Practice file: <a href="/exercise-files/TEXTBEFORE-TEXTAFTER.xlsx" download class="text-[#0a66c2] hover:underline">TEXTBEFORE-TEXTAFTER.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2:

You have customer feedback entries like:
<strong>"Feedback from: John Smith | Rating: 8 | Category: Product Quality"</strong>

Extract just the <strong>customer name</strong> ("John Smith"). Which function(s) would you use and what's your approach?`,
      idealAnswer: `Use TEXTAFTER and TEXTBEFORE: =TEXTBEFORE(TEXTAFTER(A1, "Feedback from: "), " |"). TEXTAFTER grabs text after the prefix, then TEXTBEFORE grabs everything before the first pipe.

Alternative: MID+FIND for the classic approach, but TEXTAFTER/TEXTBEFORE is cleaner.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly uses TEXTAFTER/TEXTBEFORE (or MID+FIND) to extract the name with clear logic. May mention both approaches.
- 4 (Proficient): Correctly extracts the name with appropriate functions.
- 3 (Competent): Identifies the right functions but approach is unclear.
- 2 (Basic): Mentions text functions without clear extraction logic.
- 1 (Novice): Cannot identify text extraction functions.

SCORING DECISION TREE:
1. Does the response correctly extract the customer name? → If NO, max Level 3.
2. If YES: Are there logic errors? → If YES, score Level 3.
3. If YES (correct extraction) AND NO errors: Score Level 4.
4. Does it show step-by-step logic AND mention alternatives? → Score Level 5.

ERROR HANDLING: If wrong delimiters are used (e.g., ":" instead of "Feedback from: "), flag this. Caps at Level 3.`
    },
    part3: {
      question: `Now for Part 3:

Your manager says: <em>"I need to generate 100 random test records with ratings between 1 and 10."</em>

<strong>(1)</strong> Which function and what arguments?
<strong>(2)</strong> Name one important characteristic your manager should know about.`,
      idealAnswer: `(1) RANDARRAY — =RANDARRAY(100, 1, 1, 10, TRUE). Arguments: 100 rows, 1 column, min 1, max 10, TRUE for whole numbers. Spills 100 random integers.

(2) It's volatile — recalculates every time anything changes. Copy and Paste Values to freeze the numbers.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies RANDARRAY with all key arguments AND explains volatility with the Paste Values tip.
- 4 (Proficient): Identifies RANDARRAY with most arguments and mentions volatility.
- 3 (Competent): Identifies RANDARRAY but misses key arguments or volatility.
- 2 (Basic): Mentions RAND or RANDBETWEEN instead of RANDARRAY.
- 1 (Novice): Cannot identify the function.

SCORING DECISION TREE:
1. Does the response identify RANDARRAY with correct arguments AND mention volatility? → If NO, max Level 3.
2. If YES: Are there argument errors? → If YES, score Level 3.
3. If YES (correct RANDARRAY + volatility) AND NO errors: Score Level 4.
4. Does it include Paste Values tip AND all arguments? → Score Level 5.

ERROR HANDLING: If RANDBETWEEN is suggested for an array, note it generates a single value. Cap at Level 3 if RANDARRAY is not mentioned.`
    }
  },

  excel_capstone: {
    id: 'excel_capstone',
    expectsFileUpload: true,
    uploadFileName: 'FILTER.xlsx',
    initialQuestion: `Congratulations — you've reached the Capstone! This exercise brings together skills from the entire course.

Download <a href="/exercise-files/FILTER.xlsx" download class="text-[#0a66c2] hover:underline">FILTER.xlsx</a> and open it in Excel. The sheet has vacation packages with columns: Vacation Package, Destination ("Beach"/"Desert"/"Big City"), Days, and International ("x" or blank).

<strong>Your goal:</strong> Create two dynamic results:
<strong>(1)</strong> A formula that shows only <strong>international Beach</strong> vacations — where Destination is "Beach" AND International is "x". Both conditions must be met.
<strong>(2)</strong> An alphabetized list of all unique Destinations (no duplicates), generated by a single formula.

Save and upload your file below.`,
    idealAnswer: `The file should contain:
(1) A FILTER formula like =FILTER(B1:E28, (C1:C28="Beach")*(E1:E28="x")) that shows only international Beach vacations using multiplication for AND logic.
(2) A SORT(UNIQUE(...)) formula like =SORT(UNIQUE(C2:C28)) that extracts and alphabetizes distinct Destinations.`,
    scoringCriteria: `SCORING CRITERIA — FILE UPLOAD MODE:
The learner uploaded an Excel file. Look for FILTER and SORT/UNIQUE formulas.

- 5 (Expert): File contains both a correct FILTER formula using multiplication for AND logic (Beach + international) AND a SORT(UNIQUE(...)) formula producing a clean sorted list.
- 4 (Proficient): File contains both formulas with correct structure.
- 3 (Competent): File contains one of the two formulas correctly, or both with issues (e.g., using AND() inside FILTER).
- 2 (Basic): File contains a formula attempt but with significant errors.
- 1 (Novice): No FILTER or SORT/UNIQUE formulas found.

SCORING DECISION TREE:
1. Does the file contain both a FILTER and SORT/UNIQUE formula? → If NO, max Level 3.
2. If YES: Does FILTER use multiplication (*) for AND logic (not the AND() function)? → If NO, score Level 3.
3. If YES (both correct): Score Level 4.
4. Do both formulas produce correct results (filtered list + sorted unique destinations)? → Score Level 5.

ERROR HANDLING: If AND() is used inside FILTER, flag this — AND() returns a single value, not an array. Use multiplication. Cap at Level 3.`,
    goalText: "Course Capstone: build a dynamic dashboard, plan an analysis, and present to leadership.<br>This Skill Builder has 3 parts.",
    durationText: "6-8 minutes",
    prepareItems: [
      'Review all course chapters',
      'Practice files: <a href="/exercise-files/SUMIFS-COUNTIFS.xlsx" download class="text-[#0a66c2] hover:underline">SUMIFS-COUNTIFS.xlsx</a> and <a href="/exercise-files/FILTER.xlsx" download class="text-[#0a66c2] hover:underline">FILTER.xlsx</a> <span class="text-xs text-gray-500">(download)</span>'
    ],
    part2: {
      question: `Now for Part 2 — analysis planning.

A fitness center chain has 3 sheets: Members (ID, Name, Join Date, Type, Location), Visits (Visit ID, Member ID, Date, Location, Check-in/out), Revenue (monthly by location).

The CEO asks: <em>"Should we expand our Downtown location?"</em>

<strong>(1)</strong> How would you count Premium and VIP members at Downtown? Which function?
<strong>(2)</strong> How would you pull member names into the Visits sheet by Member ID? Which lookup?`,
      idealAnswer: `(1) COUNTIFS — two criteria (location + membership type): =COUNTIFS(Location, "Downtown", Type, "Premium") + similar for "VIP". COUNTIFS handles the multi-criteria count.

(2) XLOOKUP — =XLOOKUP(MemberID_in_Visits, MemberID_in_Members, FullName). Clean syntax, no column index needed, defaults to exact match.`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): Correctly identifies COUNTIFS for multi-criteria count (handling Premium and VIP) AND XLOOKUP with clear reasoning.
- 4 (Proficient): Correctly addresses both tasks with appropriate functions.
- 3 (Competent): Addresses 1 of 2 tasks correctly or both with gaps.
- 2 (Basic): Addresses 1 task vaguely.
- 1 (Novice): Cannot identify appropriate functions.

SCORING DECISION TREE:
1. Does the response correctly address both tasks? → If NO, max Level 3.
2. If YES: Are there errors (e.g., COUNTIF instead of COUNTIFS)? → If YES, score Level 3.
3. If YES (both correct) AND NO errors: Score Level 4.
4. Does it handle Premium AND VIP counting AND explain XLOOKUP advantages? → Score Level 5.

ERROR HANDLING: If COUNTIF (singular) is used for multiple criteria, flag this. Caps at Level 3.`
    },
    part3: {
      question: `Now for Part 3 — present to leadership.

The CEO says: <em>"Summarize in 3-4 sentences for the board — they're not Excel people. What does the data tell us about Downtown, and should we expand?"</em>

Write a jargon-free summary using data points you'd expect (member counts, visit patterns, revenue trends).`,
      idealAnswer: `"Downtown has the highest concentration of Premium/VIP members with longer average visit durations, suggesting strong engagement. Revenue has trended upward over 6 months, outpacing other locations. Based on growth rate, we'd project hitting capacity within [X] months, making expansion timely. I recommend a phased expansion — the data shows strong demand and a clear return path."`,
      scoringCriteria: `SCORING CRITERIA:
- 5 (Expert): References specific data points (member counts, visits, revenue), makes a clear recommendation, includes projections, and is free of Excel jargon.
- 4 (Proficient): References 2-3 data points with a clear recommendation. No jargon.
- 3 (Competent): Makes a recommendation but lacks data references or includes jargon.
- 2 (Basic): Vague summary without data or recommendation.
- 1 (Novice): Off-topic.

SCORING DECISION TREE:
1. Does the response reference data points AND make a recommendation? → If NO, max Level 3.
2. If YES: Does it include Excel jargon (XLOOKUP, COUNTIFS, spill ranges)? → If YES, score Level 3.
3. If YES (data + recommendation) AND NO jargon: Score Level 4.
4. Does it include projections AND 3+ data points with actionable recommendation? → Score Level 5.

ERROR HANDLING: If Excel functions are mentioned in a board presentation, flag this — the CEO said they "aren't Excel people." Caps at Level 3.`
    }
  }
};

export const EXCEL_MODULE_SUBTITLES: Record<string, string> = {
  excel_tables_arrays: "Understand Tables and dynamic arrays",
  excel_dynamic_intro: "Understand dynamic array spill behavior",
  excel_conditionals: "Choose the right conditional function",
  excel_sumifs_practice: "Apply SUMIFS and COUNTIFS to real data",
  excel_lookup_basics: "Compare VLOOKUP and XLOOKUP",
  excel_choosing_lookups: "Choose the right lookup for the job",
  excel_ch3_wrapup: "Design a multi-lookup pricing calculator",
  excel_formula_strategy: "Improve formula readability and performance",
  excel_formula_design: "Build complex formulas step by step",
  excel_ch4_wrapup: "Apply LET, error handling, and 3D formulas",
  excel_midterm: "Mid-course skills check",
  excel_datetime: "Apply date, time, and year-fraction functions",
  excel_text_functions: "Extract and clean messy text data",
  excel_dynamic_arrays_practice: "Build a dynamic dashboard with FILTER, UNIQUE, TOCOL",
  excel_ch7_wrapup: "Combine text and dynamic array functions",
  excel_capstone: "Course Capstone: Analyze, Build, Present"
};
