export const excelTranscripts: Record<string, string> = {
  "Learning advanced formulas and functions using Excel": `So you know how to use an IF statement,
you know how to do a sum, (chill jazzy music)
but there are over 500 functions in Excel.
What are some that you need to know?
Well, I'm going to show you in this course.
I'm going to show you Mod, X-Lookup,
I'm going to cover the dynamic arrays.
They are brand new in Excel.
You're going to see Unique, Filter, To-Call,
and the advanced formula piece
is how do you weave these functions together
into beautiful, robust solutions?
That's what's in this course.

If you would like to learn some advanced Excel,
join me in this course.`,

  "Developing your own style with formulas and functions": `Okay, now this is serious.
Before we get into the course, I want to tell you...
No, I want to invite you and give you permission
to find your style of how you want to work with Excel.
There are people who write big formulas,
people who write helper columns,
people who put different things on different sheets
and then bring 'em all back
and summarize 'em on another sheet.

There's all kinds of different ways of working.
There are people who like named ranges.
I personally don't like named ranges.
I don't think they're evil, I just don't use 'em.
And I'm saying to you, use what works
for you in your style, what you are comfortable with.
If you prefer working with the interface
versus writing a lot of things from scratch, that's okay.
As long as you are delivering
for the people who need what you are providing,
that's what's most important.

Are they happy?
And I'm going to tell you one thing.
I've spent years as an analyst, and nobody has ever said,
"You know, my commission's calculated right,
but you used helper columns,"
or, "You used this big massive formula,"
or "You didn't use named ranges, or you used V Look."
No, they never said that.
The work was accurate in my style,
the way I worked in order to get things done for them.

So if you see another Excel user,
and they're doing some impressive things,
sure, learn from that.
Continue to expand and learn and grow.
But also, don't apologize if you're not somebody
who likes writing big monster formulas.
This is about you and the people who rely on what you do.
This is not about impressing other Excel users.

Develop your own style, unapologetically.`,

  "Challenges": `Say, there's something that I snuck into the course.
There are some challenge videos
because I constantly get emails and DMs.
People want hands-on learning.
They don't want to just look at me do stuff.
No, in order to get good, in order to truly advance,
you need some hands-on and not even just a quiz,
but really a challenge.

There, in the course two spots.
Midway through the course,
you're going to get several challenge videos.
I will set up the challenge,
give you an opportunity to pause the video
and then come back and watch me work through the challenge.
And I'm telling you that they're not easy.
They are going to challenge you
because I want you to be good with Excel, alright?
So we are not here to play around.
So you will get those challenge videos a few midway
through the course and a few at the end.

Going to make you strong.`,

  "Tables": `Let's talk about tables
and how they're different from ranges in Excel.
Here we've got identical sets of data.
Starting in row four, we've got Date, Category, and Expense,
for both the table side and the range side.
And we're going to do some comparing here.
First, I am going to put this data into a table.
I'm in the Home Tab.
I'm going to go over to Format As Table.

And we can pick any of these colors that we want.
Let's grab the blue.
Okay, and then I'm going to get rid of the filter buttons.
And notice, when my cursor is in the table,
we have this Table Design Tab.
And it has things like Show A Header Row; Show A Total Row;
Filter Button, you saw me toggle that off.
There are a lot of options in here.

As well as changing the table style,
we can name the table, and that's
what I'm going to do right now.
Expenses.
Okay.
And move away from there.
Okay, and notice when I have my cursor outside
of the table, we no longer have that Table Design Tab.
All right.
So, that's one way you can know
that your data is in a table.
Another way, is that hard corner
that's on the bottom right corner of the table.

Now, over on the right side,
Columns H, I, and J, that's just regular normal Excel,
and that's called a range.
It is not a table.
Now let's check some things out.
Up here, I am going to get a total of the meals.
Equals, sumifs, open parentheses,
sum range, sum this column.
See, I did not have to drag like I would in a range,
but we'll get to that.

So now you see I have sumifs,
Expenses, that's the name of the table.
And Expense is the name of the column.
Comma, criteria range 1.
The criteria range is here.
And it's showing Expenses table,
and in the square brackets, the category column.
Comma.
What's the criteria?
The criteria is meals, and is hidden by the formula
that I'm writing.

So I'm going to go over to C1,
and slide over.
Okay, so it's D1,
and I need F4 for the absolute cell reference
Close the sumifs and Enter.
All right, this is the amount of the meals.
Okay, and I'm also going to convert this into currency.
Okay, now let's do this on the other side.

The meals.
Equals, sumifs, open parenthesis, sum range,
I have to copy this range,
comma, criteria range here,
comma, the criteria is in J1,
and then F4, and close parenthesis, Enter.
All right, good.
$144.91.
Let's also convert this into currency.

Now let's add some new data.
Ah, this updated.
Now with the new data, we're up to 161.41.
Over here, drag this in.
Now the number did not update,
but we have this error message,
"Formula Omits Adjacent Cells."
Okay, so now we've got to deal with that.

What's the problem?
All right, so I'm going to go up here.
And then, one troubleshooting method for advanced formulas,
you can go into the formula bar and it will
show you what's highlighted.
Ah, okay.
These did not adjust.
Okay.
Next, under the agreement,
lodging is only reimbursed at 85%.

So I'm going to add a column, Lodging.
Enter.
And the table grew to accept the new column.
Okay.
Over here, Lodging,
nothing happens.
Okay, now this is sweet.
Equals, if, open parentheses,
this value equals Lodging,
it's right here,
and F4, comma,
then this value
times this 85%,
and F4 to lock it down.

And notice what the formula looks like.
We've got the at symbol and category.
That's telling us that we are inside of the table
looking at the category column in that row, alright?
And then at expense, we're looking
at the expense value in that row.
And multiplying it by the F2.
Okay, comma, if the value in the category column
is not lodging, then, go ahead and grab the expense value.

Close the if statement and Enter.
Okay?
And then I'm going to highlight here,
and turn this into currency.
All right.
Did you notice the formula
went all the way down the table column?
And we look at Lodging, its calculating the 85%.
Now, let's do this over here.
Equals, if, open parentheses,
that value equals Lodging,
and F4, comma,
then this value times the 85%.

F4 to lock it in place.
Comma, if false, then bring us back the $3.20, Enter.
Great, we've got the value we want,
but we have to drag this down.
And let's turn this into currency.
Now, another thing that I can show you about tables,
let's go over here.
Go back to the Table Design Tab.

You can have a total row.
Okay, so it's giving us a total of the expenses.
You can get an average, a max,
a lot of other possibilities there.
You can also do this over here.
Maybe you want to get a count, all right?
But if you do want to add more data,
you have to get rid of the total row and then add that data,
and then bring the total row back if you want it.

That's a quick overview of tables.
There's a lot more that I invite you to explore
with tables in this Table Design Tab.
But those are the main things
that I wanted to show you for the purpose
of this Advanced Functions and Formulas course.`,

  "Tables and absolute cell references": `Tables are great for us to use.
They keep our data tight.
They help us with consistency.
There's a lot of things they do.
But, there is one thing I want to show you
in this video
about mixed or absolute references in tables.
Okay.
We have this data about these reps,
their quotas, et cetera.
Right?
And then I'm going to go up here
to table design with my cursor in that data set.

Right?
And you can see that the table's name is Performance.
What I want to do now,
in this area,
retrieve the data
for each of these reps.
And I'm going to use an XLOOKUP.
So here we go.
Equals XLOOKUP,
double quote.
Look up what?
Look up Anita.
Now, in anticipation of dragging this formula
down and to the right,
I need to think about the sale reference.

I need,
column H to stay in place,
but I do want
the, rows to move.
So I'm going to go and put a dollar sign
in front of the H.
Okay?
Now, that's our lookup value, comma,
where do we want to look for Anita?
We want to look, here.
That's the lookup array.
Comma,
return array.
In this case, we want to grab, quota.

That's all we need for now.
We don't need if not found, match mode, or search mode.
Close parentheses and enter.
There is the 100 for Anita.
But now watch what happens.
I'm going to
drag this over.
Ah, we've got N/A.
Why?
Select J4.
Click in the formula bar
and now we see the columns moved.
We do want Actual,
we don't want Quota.

We need the Sales Rep column to stay in place.
Don't move at all.
Okay?
So I'm going to go over here.
I'm going to Escape and then Delete and Delete.
Now, in order to get
the Sales Rep Column
to stay in place,
I have to go into the formula.
I need to,
open the bracket,
and then
I need
to go to the end of that closed bracket,
put a Colon,
and then
open the square bracket.

And now you see it's given me the different options.
Sales Rep is what I want.
So I'm going to double click there,
and then close square bracket.
Okay?
That closes the second sales rep.
And then close square bracket again.
And Enter.
Now watch.
I'm going to go back to Quota,
back to I4.
Drag it over.
Look at that.

Look at that.
Now I'm going to grab this handle,
drag it down.
Oh my gosh.
Now let's check the accuracy.
Okay, let's look at Gerard.
70 was the quota.
74 actual in both places,
105.7% of quota,
and a difference of 5.7%.
We got it.
But we can do one other thing.

Highlight these.
We want 'em formatted as percentages,
and, how many decimal places?
Let's take it out to one decimal place.
So go over here, click increase the decimal place.
There we go.
And that is how you work with
mixed references
in a table.
You have to do that manually using those square brackets.`,

  "Dynamic arrays introduction": `Let's talk about the new calculation engine
that's behind Excel and the new dynamic array functions.
We're not going to go into depth,
in this course, with the dynamic arrays
because they are worthy of entire courses.
And in fact, I have a course on dynamic arrays
in the LinkedIn Learning Library, as do other authors.
So check 'em out.
Go deep on this because they are so powerful.
But first, let's take a look at the new calculation engine,
and then we'll look at specific functions.

Okay, let's look at this.
Some basic thing that we often need to do.
We want to calculate the days
between the start and end dates.
So here we go.
Equals, I'm going to highlight the entire End,
and then minus the Start,
Enter.
Oh, we got a spill error.
That means there's not enough free space
for Excel to show us the full results.

So go back to the formula.
Look, the dashed blue line is saying,
"This is how much room I need in order to give you
what you got."
Okay, so I'm going to move this out of the way.
See, I did that on purpose.
Ah, now we have the data.
Okay, move this out of the way.
Double click here.
All right, so those are the days.
Now I'm going to go to D5.
Look in the formula bar, and the formula is grayed out.

That's another clue that I'm dealing with a dynamic array.
So go back, and if I need to make any adjustments,
they have to be made right here.
So I want to go back and say,
max, open parentheses,
close parentheses, Enter.
So the max was 3046 days.
All right, undo that, and let's check that out.
Yep, there it is, 3046 days.

So that's the calculation engine.
We used no functions with this,
but we can put one formula
and get multiple results back.
Now let's look at sheet two.
Here are 18 of the dynamic array functions.
There are even more.
Microsoft keeps releasing new functions just constantly.
and it's exciting.
It's hard to keep up.
But here are 18, and you will see some of them
in the course as we go through it.

Now let me show you a couple of things,
and then we're going to get on out of here.
Okay, we've got the 18 functions in 18 different cells.
Three columns, four rows.
How about this?
Equals TOCOL.
Uh-oh, look at this.
What's the array?
'Cause I want to convert it into a column.
Look at that.
Now Enter.
Everything is in one column.

I didn't have to drag anything around,
take it into power query, et cetera.
So now what if I want to do this?
Equals sort.
Okay, that's the array.
Comma, I don't want to sort index, comma sort order.
I want to put -1 to sort descending.
There we go.
CHOOSECOLS is on the bottom, WRAPROWS is on top.

Something else that we can do,
we can go over to this cell and
equals, sequence, double click,
how many rows?
I want to counta, open parentheses,
and then I want to count
everything that is in the array that I've already created.
And that means I'm going to need that hashtag
to count everything in that dynamic array.

Without the hashtag, we only get H3.
So I'm going to close the counta.
I only want one column.
I want to start at 1 and have it increment, step 1.
But those are the defaults.
So I can go ahead and close the sequence and Enter.
See, 1 through 16.
Now we scroll back up.
There's so much more that we can do with the dynamic arrays.

This is just a little taste,
but you can get a bigger taste by going into the library
and checking out my course on dynamic arrays,
and some of the many other excellent courses on this topic.
Meanwhile, we are going to get on
with the advanced functions and formulas.`,

  "IF function": `Okay, I do know that this
is an advanced functions and formulas course.
And yes, let's review if.
Okay, it'll help us ease into the rest of the course.
Here we have data, we've got our items.
We have in orange, the low level amounts,
and then what we have in inventory.
Now, we want a column that says
what's low, and what's okay.

Right?
Basic IF statement.
Here we go.
Cursor is in that first cell,
equals if open parentheses, if what?
Okay, what is our first logical test?
And then we'll want to know,
what we want the formula to do if it's true,
and then if it's false, okay.
So low is if the end inventory value
is less than R equal to.

That's important.
Okay?
My logical test is going to be
if the low level value, is less than the In Inventory.
So I got to be a little sneaky in how I get to it.
I'm going to click in the cell below,
and then use the up arrow to get to the cell that I want.
If low level is less than the inventory level.
And we actually want less than our equal to.

Go to the end, comma, then double quotes, okay?
Otherwise, double quotes low, double quotes,
and then close the IF statement, Enter.
So let's look at this.
For A 1600, is okay, because yes the inventory
is greater than the low level.
But now let's look at W0026, 20 equals 20.

That should be low because where those values are equal,
that counts as low.
So I'm going to go here.
Now I'm going to go back,
and get rid of this equal sign, and then enter.
Everything updated, right.
So now W0026 is right, it's showing as low.
The last one W0252 is okay.

Everything is good.
Next, less nest an if inside an if.
So, if the In inventory value
is less than or equal to low level value, we want to show low.
It should show, okay.
If the In inventory value
is greater than the low level value.
And check, if the In inventory value
is blank like M2115, it's blank.

We don't know if that's supposed to be a zero.
Are we just missing data, we don't know.
Okay?
Cursor in E three equals, if open parentheses.
If the In inventory value, equals nothing,
then check.
And that has to be in double quotes.
Otherwise, what?
Now we want to if open parenthesis.

If the In inventory, I'm going to select here,
and then use the up arrow.
If the In inventory value
is greater than the low level value.
Okay, then.
Okay.
Otherwise low.
Again in double quotes.
Close the second If statement.

Now close the first If statement and Enter.
Let's check the results.
We've got two checks.
Check is in M2115 and W0019B1212 is okay,
because the 86 is greater than 75.
For W0026, yep, 20 equals 20, and that's considered low.
We are good.
And that's the IF statement,
and nesting an if, inside an if.`,

  "SUMIFS and COUNTIFS": `Let's do some sums and counts
based on criteria.
Here we are on our overview page
where we want to create some summaries.
Now let's go over to the donations page.
Look, we have a table with donations, the dates,
if the payment is a recurring monthly payment,
and how it was paid,
online, check or cash.
Scroll down.
There is our data,
all of the donations also with the cursor in the table.

I'm going to go to table design
and you can see the table's name is donations.
Okay, let's go back.
Overview.
In C9, I want to get a count of the cash payments
that were greater than are equal to $250.
Here we go.
okay, COUNTIFS, double click that.
What is the criteria range?
I want to count here.

That's the payment method.
Comma, what is the criteria?
The criteria is cash.
And I'm going to hit enter.
Now, this is telling me that they were eight cash donations,
okay, and we can check that, okay?
With my cursor in the table,
go to table design.
I want to filter buttons.
Let's see, I want cash.

Okay, you can see there are eight cash donations.
And while we're here,
we can see none of them are greater than or equal $250.
So that gives us a little headstart
in what we are going to be doing.
Go back to data and clear this filter.
All right, now, back in C9, go back,
clear that closed parenthesis,
comma, what is my second criteria range?
The amount.

Go back to donations,
the donation amount,
hover until I see that black arrow
and highlight the entire column.
Comma, what is the criteria?
Okay, I'm going to go back to overview
and I'm going to select the $250,
but we're not done because we want a logical operator.
We want greater than our equal to.

All right, so we have to go into the formula.
I'm going in front of that overview, double quote,
greater than or equal to double quote.
And then we need the ampersand.
Now I can go all the way to the end and enter, right?
None were cash donations over $250.
Now I'm going to go back up here
because I'm going to drag this formula down.

I want C7 to be locked in place,
so I'm going to hit F4
so that I have dollar sign C dollar sign seven,
hit enter, go back to C9, drag it down.
Two checks over $250 to online payments.
Let's verify that.
Donations, okay, want filter.

Go to the donations filter, number filter,
greater than or equal to 250.
And okay, there we are.
Two checks, two online.
Our formula is right.
So clear the filter.
Go back.
Now for the SUMIFS equals, SUMIFS.
Double click, sum range.
Donations, I want to sum the donations column,
comma, what's the criteria range?
We've got two criteria we want to go for.

We want to do the greater than an equal to 250,
and we want to check the payment type.
Let's do the amount first, criteria range, okay.
Comma, double quote,
greater than, equal to, double quote, ampersand.
Now go back,
need to grab the 250,
and F4 for the absolute cell reference.

Comma, criteria range two,
go back, payment method,
comma, criteria two.
Back to overview.
We want cash, and enter,
and drag this down.
Great, two checks totaled $1,855.
Now, dates are really tricky with SUMIFS and COUNTIFS.

We do have all of these dates,
the day, month, and year,
but we can't ask it for just January or just February.
I had to put in these dates,
the first of each month.
So now I want to get a total amount for January
where the payment method was not online
equals SUMIFS, double click,
sum what range, sum the donation column,
comma, criteria range.

This criteria range,
comma, what's the criteria?
I'm going to type this in.
Double quote, does not equal, double quote,
and in double quotes online, double quote.
And I'm going to hit enter.
And this is one way of making sure that the formula,
as I'm building it, that it is working,
where if I had hit enter
and then got an error or some odd result,
then that would let me know don't go any further,
fix what you broke.

But we're okay right now.
Now we can add the criteria for the month.
Now, pay attention here.
Going to the end,
I'm going to get rid of this parenthesis.
Comma, now we want criteria range two.
The criteria range is the date.
Comma, what's the criteria?
Go back to the overview page.

I'm going to get rid of overview for now.
It'll be back.
I want double quote,
greater than or equal to, double quote,
and the date for January.
So now that's greater than or equal to the 1st of January,
but we need to only go until the end of January.
Right now, this would give us everything
after the 1st of January,
including April dates.

So comma, criteria range three,
go back to the date,
comma, double quote,
less than or equal to, double quote,
and, watch, eomonth.
That's the function we need
so that we get the end of the month
that starts with January 1st.
We don't have to calculate it ourselves.
Aren't you glad of that?
We already doing enough right now.

Open parentheses.
Now, what is the start date?
The start date is this date, comma,
and we want zero months.
We use zero because we want eomonth
to give us the last date of this month.
If we put a one
then it would go out to next month's last day.
So close the eomonth, close the SUMIFS, and enter.

$165 paid in January via cash or check.
Let's take a peek at that.
Donations.
And then let's look at the date, unselect all.
I'm going to select January.
Okay, and then payments.
I don't want online.
Okay, I'm going to highlight here.
All right, great, $165.

All right, now clear that filter.
Overview, yep, $165.
Let's drag this down.
Good, and let's turn this into money.
Great, now let's do a count, equals COUNTIFS,
double click, criteria range one.
Go to donations.

I want to choose this criteria range, the payments.
Comma, what's the criteria?
Where in double quotes, does not equal,
and then double quotes, ampersand,
in double quotes, online, double quote,
and hit enter.
All right, we're doing all right so far, all right.
Comma, criteria range two.
Now we want the dates.

Donations, that's the criteria range.
Comma, criteria, double quote,
greater than or equal to, double quote, ampersand.
Go back to the date.
Comma, criteria range three,
back to the date column,
comma, the criteria,
double quote, less than or equal to,
double quote, ampersand.

Now the date we have to get again,
but we need the eomonth, right?
And eomonth, open parenthesis,
go to the end, comma, zero,
close the eomonth,
close the COUNTIFS,
and one, two, three.
Wow, that is a lot of work.
Double click, send it down.

Look at that.
I've shown you a lot here,
a lot with SUMIFS, COUNTIFS.
And here's how you can start
to create your own overview pages
so that you don't have to dig through a lot of that data.
And then somebody might ask, well,
I can do this with a pivot table, can't I?
Well, let's see.
Insert a pivot table, right?
New worksheet, okay.

And let's put donation in values,
and then date here, right?
The pivot table is giving us really nice summaries.
So those are the sum of the donations,
and we can even separate it by recurring and non-recurring.
So these would be recurring payments,
and these are non-recurring.
One thing about pivot tables,
if your data updates,
you have to remember to refresh your pivot table.

A formula will automatically update.
Also you have to have room for a pivot table.
Sometimes you want to move the fields around,
and then the pivot table starts moving your other data.
It warns you
that one pivot table is about to slide into the other one.
And so you have to make decisions.
There are times where a pivot table is perfect,
and then there are times
where you can truly customize exactly what you want
by making your own summary sheets.

And you can use COUNTIFS, SUMIFS,
averages, MAXIFS, MINIFS,
you have the power.
And that's the conversation about SUMIFS and COUNTIFS.`,

  "MAXIFS, MINIFS, and AVERAGEIFS": `Here we go, maxifs and minifs,
two relatively new functions that are a lifesaver.
They will allow us to get the maximum value
or the minimum value based on criteria.
Here we are considering vacations.
In columns B through G we've got
the vacation, the price, the destination.
If it's a desert, a cruise, big city.
If it's US or international.

The start date of the vacation package
and how many days it is.
In I and J, we have our criteria.
We don't want a destination of a big city.
We want it to be International
and our maximum budget is $2,000.
And I'm going to put my cursor inside the table.
We get the Table Design tab available
and go over and we see that the table's name is Vacations.
Now let's get the max, min, and average prices.

Equals maxifs. Double click the maxifs.
The max range, we want the maximum price.
Hover over the column hitter, wait for that black arrow
and then click and it grabs the entire column.
Comma criteria range one.
Let's do the US versus International.
Go over to this column header, wait for that black arrow,
highlight that entire column, comma, what is the criteria?
The criteria, I can type as International and that has to be
in double quotes or I'm going get rid of that.

I am going to highlight the cell with INT.
And in anticipation of dragging this formula down
I don't want J-3 to move,
So I'm going to hit F-4 to lock that in place.
I'm going to hit Enter even though we aren't done.
Here we go Enter, right now we've got
$3,619 as the max price based only on the criteria
of international.

So we can use maxifs with one criteria.
And by the way, you can string together as many
as 126 criteria.
Okay, let's keep going.
Comma, criteria range two.
Let's do the exclude big city criteria.
I'm going to again highlight,
that's my criteria range,
that's where I wanted to check for the criteria, comma,
now here is something quirky.

We want it to not equal big city.
So what I have to do is double quotes,
and then does not equal double quotes,
&, so that's what I have to do if
I want a logical operator as opposed
to when we did international, we just wanted INT.
We didn't apply a logical operator there
but we are doing it here,
and we have to put the operator
in double quotes with an & and then big city.

And again, I don't want that to move
when I drag the formula down
I want F-4, comma, max budget, criteria range
that is the price column, comma,
we want it to be less than or equal to the value in J-4.
So double quote, because I'm using a logical operator,
less than or equal to, in double quotes, ampersand,
J-4, F-4 for the absolute cell reference,
close parenthesis and Enter.

So the max price is $1,760 based on the criteria.
Minifs and averageifs work the same way.
So here's what I'm going to do, drag this down.
Watch.
Okay, everything is all lined up properly.
I'm going to go to the beginning and type in minifs and Enter.
Next go here.

I want averageifs.
Double click it.
Okay, I've got to get rid of this part.
Okay, now I can hit enter.
Good. And I want to turn this into currency.
Currency, and let's see, lower it down
to zero decimal places.
All right.
Now what if I change the budget to $3,000, right?
The maximum price changed, the average price changed.

Everything updates, everything is dynamic.
Let's change this to $2200.
Enter. Okay, and then watch this,
I'm going to slide down,
we have some other vacations to consider.
I'm going to slide this up and add this to our
table and let's see if anything changes.

Yep, everything updated.
We now have a minimum price of $795,
and that is for package R
that goes to a desert destination.
And that's maxifs, minifs and averageifs.`,

  "VLOOKUP": `Let's talk about VLOOKUP.
This function is often the turning point
for a lot of Excel users.
I know it was for me, and I've talked with a lot of people.
VLOOKUP has multiple components to it,
and it's not so straightforward.
Like if you have sum,
you can go to a sale, click equals sum,
open parentheses, highlight your range, boom,
then you've got your sum.

But VLOOKUP requires you to slow down and think.
And once a person has that and they're comfortable
with VLOOKUP, they are like wide open.
They are free to go just about anywhere they want in Excel.
So I'm going to help you
with that turning point, if you aren't already there.
But I also have to say XLOOKUP
came out a few years ago,
and it was designed to replace VLOOKUP
because VLOOKUP has some weaknesses
and I will point those out.

So let's get into the data,
enough of me talking.
All right, we have this data.
We got CC-5M0749,
the transaction was for $84 and 14 cents.
We want to get the category and the level of the transaction.
Okay, real life situation,
you've got a report that came in with the ID and the amount
but now we've been tasked to match
up the category and the level.

Oh, okay.
Over here we have the ID, the name and the specialization,
the specialization is the category,
that's what we want to retrieve.
And then for each amount
we want to assign a level to it, okay?
The specialization data is not in a table
and that's deliberate cause I need to show you some things
and this data,
yeah let's go ahead and put this into a table.

The cursor is within A data set.
I'm going to go format as table.
Let's grab black one, table does have headers.
Yes. Okay, get rid of the filter buttons.
Alright, equals VLOOKUP,
double click, look up what?
Look up that first ID comma, the table array.
Where do we want to look for that ID?
We want to go over here, to this data set.

And for VLOOKUP,
we have to copy the data
that we want to look up and the data that we want to retrieve,
it's all got to be here, even though we don't want the name,
we have to copy that.
And then I'm going to hit F4 because when the
formula goes down the column on the transactions page
I do not want this moving on me.

Alright, comma column index number,
which column do I want it to bring back?
I want one, two, three, specialization,
that's the third column.
Three, comma range lookup.
Do I want an approximate match or an exact match?
I want an exact match
and I'm going to type zero
and then close parentheses, enter, alright
CC-H2VUKI,
It's saying electronics, let's check that.

Let's go back.
Yep, that is Jean-Pierre and electronics.
Good, now let's go back to transactions.
Okay, we've got food, safety, electronics, arts, and crafts.
All right, so we have some N/A's.
And let's say that we know
that N/A's means that this transaction was processed
by somebody who no longer works here.

So we're going to have to set these aside
and figure out the category separate.
Okay, but what we can do is go
up to the formula and wrap this in if N/A
because it was not found open parentheses, okay,
we have the value and what do we want to put
in replace of just the hashtag N/A error.

Say ah, no longer employed.
And it has to be in double quotes and close parentheses
for the if N/A and enter.
And notice, because this is in a table, I made that change
in one cell and the formula has populated
throughout the entire column, double click there.
Okay, And also, let's ask,
why would we want to do something like this?
Well, we might want to use a pivot table to compare the food
safety values against electronics
and event planning et cetera.

We might only be concerned about automotive data
and we need to get everything categorized so
that we can then filter everything else out.
Lots of reasons why we would want to match this up.
Okay, now we need to level,
now we're going to do something different with the VLOOKUP.
Go over the level, equals VLOOKUP,
double click it once more, look up what?
We want to look up the dollar amount, comma the table array.

Go back to reps and levels, highlight both of the columns,
comma column index number,
we want the second column, comma,
and we want true for an approximate match.
What that will do is from zero up to a hundred,
The assignment is going to be L1.
So we don't need say an $83 and 4 cents,
specifically in this table,
when we do an approximate match.

So I'm going to go and put
one for true
because I Want the approximate match,
close parentheses and enter.
There we are, we have an XL here,
for the $736.66
Let's look at what's happening there.
Anything $700 and above will get XL.
And one thing about VLOOKUP,
in order for the approximate match to work,
this column does have to be sorted ascending.

So that's VLOOKUP for you.
Let's go back to the transactions,
and a next step could be to wrap
the level in an if N/A and pick what we
want that to show instead of the error message,
or we can leave it as an error message.
But right now we've got what we needed,
and VLOOKUP made it pretty simple.
One requirement of VLOOKUP,
the column that has your lookup values
has to be the left most.

And what you want to retrieve has to be to the right of that.
There could be 1, 2, 50.
How many ever columns to the right.
But VLOOKUP cannot be look leftward.`,

  "XLOOKUP": `This is exciting, XLOOKUP.
This was designed to replace VLOOKUP
and be a lot more robust.
As we go through this video, I will mention
some of the differences between XLOOKUP and VLOOKUP.
Okay, we got these transactions and this is a slight twist
on the example from the VLOOKUP video.

So we've got these transactions,
we want to retrieve the reps name,
we've got the ID, all right,
so let's go over to reps and badges.
Ah, okay, we got the ID
and then two columns over,
we have the names.
That's what we want.
And this is the first to point out
about the difference between VLOOKUP and XLOOKUP.
XLOOKUP can look toward the left.

Let's do it.
I'm in the column where we want names.
Equals XLOOKUP, all right, double-click that.
Lookup, what? Lookup the ID.
Comma, look for it, where?
I'm going to go over to the table.
Look for the ID
here in that column.

Comma, return, what?
Return the name.
And notice, I am telling XLOOKUP what I want.
I don't have to copy a lot of columns
that I don't need in order to then count 1, 2, 3,
or whatever the column that I want to retrieve.
I'm telling XLOOKUP explicitly what I want to have done.
Comma, if not found.

Wow, that is part of XLOOKUP.
We don't have to wrap it in an if n/a
like we do with VLOOKUP.
So we know that there are some people
who no longer work here.
So let's put double quote, double quote
so that those transactions will remain blank.
Comma, match mode,
we don't care about that for this situation.
We don't care about the search mode either.
So I'm going to delete that comma.

Close parenthesis on the XLOOKUP. Boom.
There are the names and a blank
for somebody who no longer works here.
Check that out.
It's all filled in and we were able to look left.
All right, let's go over here. Check this out.
We want to retrieve each person's location.
So Connie's badge number is 309
and over in columns I and K, we have this data.

It was really about the location
and the phone number at the front desk,
but then we added on later the badge numbers.
But look at this, I'm going to highlight in that column
and then go to Data and then sort ascending.
This is the way that this would have to be
if I use VLOOKUP, I've got to sort that look up range.
But wait a minute,
I want to see the data sorted alphabetically
by the location.

Put this back, okay, because we can do that with XLOOKUP.
So I'm going to put location, right.
Getting ready for the good stuff. All right.
Equals XLOOKUP,
double-click, look up, what?
Look up the badge number.

Comma look up array.
I want to look up here.
That's where I want to find the badge numbers.
Comma return array,
return the location.
And I'm going to highlight it this way,
because the tip menu is in the way.
So we can see up in the formula bar
that I do have table four location.
That's what I want, that column.

Comma if not found, I'm not so worried about that.
Comma match mode. That's the exciting part.
We want exact match our next smaller item.
So that's negative one.
I'm not concerned about the search mode right now.
So close parentheses and Enter.
Now let's see if this makes sense.
Connie, badge 309, would that be Northwest?
Well, let's go ahead and look at it this way.

Sort, okay.
From zero to 350 that is Northwest. That's right.
How about Gator with badge number 1,604?
And it's showing Gator's location is Cosmos. Yes.
From badge number 1,600 and above,
yes, the location is Cosmos.
And now let's put this back to the way that we want to see it.

There we go.
All right, now I'm going to show you something really slick.
VLOOKUP cannot do this.
I am going to do a bottom up search,
because we have these trainees
and they had to complete courses.
And here they are, here are the course completions
in columns F, G, and H.
The completion dates are sorted ascending.

And notice, Molly is in here three times for course 1,
course 2, and then course 2 again.
Maybe Molly failed course 2 that was completed
on the 19th of May and then retook it and passed it
on the 16th of June.
We care about the first date and the last date.
All right, let's do it.
Equals XLOOKUP, double-click, look up, what?
Look up David.

Comma, look up David, where? Here.
Comma return, return the completion date.
Comma if not found, I'm not worried about that.
Comma, I want an exact match for David, zero.
Comma search mode. Search first to last.
So I want to put a one right here,
close parentheses and Enter.

So what we know is that Jean-Pierre
was not required to do the training.
And we have the dates.
Those are the numbers that Excel users
to store dates in the background.
And these are the start dates.
I want to go back to the beginning,
because now I want the end dates.
Equals XLOOKUP, double-click, look up what?
Look up Gator, all right.

Comma look up array.
Look for Gator right here.
Comma the return array, the completion dates.
Comma if not found.
I'm going to put a zero.
Comma match mode.
I want an exact match, so that's going to be zero.
Comma, now I want to search last to first, negative one.

Close parentheses, now I want to put a minus here, okay.
Now I'm going to go back into the start dates
that we calculated and I'm going to go
to the if not found portion,
and that was over here, okay.
And I'm going to put a zero. Now Enter.
This shows us the number of days
that everybody took from the time
that they started their curriculum
to the time that they finished.

And is not tripped up by people
who took either of the courses more than once.
We want the first one, the last one,
and that's what we got
and that's what XLOOKUP up gave us.
XLOOKUP, play with it, fall in love with it.`,

  "VLOOKUP and XLOOKUP comparison": `Let's take a moment to look at
a side-by-side comparison of VLOOKUP and XLOOKUP.
So with VLOOKUP, the lookup has to look right.
The return array has to be to the right of the lookup array.
But with XLOOKUP, it does not matter.
For values that aren't found, any hashtag N/A errors,
you have to wrap VLOOKUP in an if N/A.

But with XLOOKUP, there is a built-in component
for if not found.
For the return arrays,
with VLOOKUP, you have to count the number of columns.
So if you have to go out 25 columns, that can be a mess.
And it's easy to make a mistake.
But with XLOOKUP, you merely select
the column that you want.
For VLOOKUP, the lookup array must be assorted ascending.

With XLOOKUP, doesn't have to be.
VLOOKUP can break,
if you insert columns.
XLOOKUP, no problem.
XLOOKUP can do vertical and horizontal lookups.
VLOOKUP can only do vertical.
One big complaint about VLOOKUP is that it defaults
to an approximate match when 90% of people
are doing exact matches.

So you have to include a false or a zero
at the end of a VLOOKUP.
With XLOOKUP, it defaults to exact matches.
And before VLOOKUP came along,
doing a bottom up search was torture.
We can do a bottom up search with XLOOKUP.
We cannot with VLOOKUP.
Those are several really big details comparing VLOOKUP
and XLOOKUP, and what makes XLOOKUP more robust.

But, VLOOKUP still has a place.
If you need to do something really simple and fast,
use VLOOKUP.
Use XLOOKUP.
Either one, but these are two
very useful tools that are available to you now.`,

  "INDEX/MATCH": `It's time to talk about INDEX MATCH.
INDEX MATCH can be used as a more
robust alternative to VLOOKUP.
But now we have XLOOKUP,
and in my opinion,
XLOOKUP is more robust than INDEX MATCH and VLOOKUP.
But let me also say,
I am not here to bash
any one of these three,
INDEX MATCH, VLOOKUP, or XLOOKUP.

You use what works for you
in the situation that you are in.
Alright, so let's get into INDEX MATCH.
In G2, I have an ID,
and I want to retrieve the name and the specialty.
See, we going to do it twice.
All right.
Notice how the data is set up.
The ID is all the way to the right,
and we need to look left.
VLOOKUP cannot look left.

If we wanted to use VLOOKUP,
we could move the ID column
over to be in the first column,
and sometimes we don't have that option.
There'd be too much stuff
to move around to get out of our way.
It could be a hassle sometimes.
So, INDEX MATCH equals,
and I'm going to start with MATCH first,
because it's nested inside the INDEX.
So I'm going to work from the inside outward.
Match.

Open parentheses,
lookup value.
The lookup value is right here.
G2.
Comma, lookup array.
Where do I want to look for that ID?
I want to look in this column.
Comma, I want an exact match,
so that's going to be a zero.
And then close the match function,
and hit enter.
10.
It's telling us that the ID
is in the 10th position in our lookup array.

Now let's go back to the formula.
Go all the way to the front.
Index, open parentheses, our array.
We want to bring back the name and specialization,
comma the row number.
That's what match did for us.
So we go to the end, comma, column number.
In this case, we want the name,
and that's going to be 1.

Close the parenthesis and enter.
Yep.
Mitten is ID CC-CT3TK2.
Let's do it one more time.
Equals match.
Open parentheses, lookup value.
It's right here.
Comma, lookup array, look for it here.
Comma, exact match.
We want a zero.
Close the match.
Go back to the beginning.

Index, open parenthesis, our array.
Highlight here,
we could highlight all three,
comma, the row number we already got.
Go to the end, comma, column number.
We want to bring back the second column.
Close the index and enter.
Yep.
Arts and crafts.
And now what if I did go over here,
and put in a three?
Enter, okay we just bring back the ID again.

So I'm going to undo that.
Okay, now watch this.
I have a dropdown list.
Alright, so this ID is tied to Jean.
Here, Romulus.
That is INDEX MATCH.
It's actually two functions,
one nested inside the other.
There are a lot of components to it,
but it does allow us
to do a left looking lookup.`,

  "The INDEX/MATCH vs. VLOOKUP controversy": `As we go deeper into advanced Excel,
there's something that I have to let you know about.
In the Excel world, the number one controversy is
over index match are V-lookup.
There's index match people who say you should never,
ever use V-lookup.
Beginners should never be taught V-lookup,
but I am here to tell you, they are two legitimate tools.
V-lookup is a function, index match is a nested function.

V-lookup does have some weaknesses
and I cover some of those in other videos in the course.
But I just needed for you to know
that there is this controversy
and I invite you not to get sucked into it.
But this is your choice, whether you want
to exclusively use index match, that's your choice.
If you want to use V-lookup sometimes,
index match sometimes, or better yet, X-lookup,
these are choices that you have to make, for your context.`,

  "Two-way lookups": `Now it's time to do
a two-way lookup.
What is that?
Let's say that I want to order the Planet7
and I want to order 33 of 'em.
I need to be able to do a lookup
that will do an intersection
showing the Planet7
and the price that I would get
for ordering 33.
So I should pay 80%.

That would be a 20% discount
and that is the 0.8 at the intersection
of Planet7 and the 20
because the 33 that I want to order
it is in between 20 and 50.
And at 50 and above, the Planet7
would be a 30% discount.
I would pay 0.7%.
Okay.
Now let's kind of refresh what we know
about the XLOOKUP because we have to get the price first.

Okay.
Here's the price equals XLOOKUP, double click.
What do I want to look up? I want to look up
curled axle,
comma,
look up array.
Where do I want to look for curled axle?
I'm going to highlight here.
And because that data is not in a table
I'm going to hit
F4 for the absolute sale reference.
'Cause when this formula is dragged down,
I don't want the formula to move.

All right.
Comma,
Return array.
I want to return the price.
Here we go.
And we need F4 again.
The if not found match mode
search mode are all optional.
In this case, I don't need any of them.
I can hit enter.
Boom. Now I have all of the prices.
Now the juicy part, the two-way lookup.
Let's go into the discount.
Equals XLOOKUP
double click.

Look up what?
Look up curled axle.
Comma,
look up array.
Look for it over here.
In I5 five through I10.
And then F4 for the absolute reference.
Comma,
return array.
Now we have to do the second part
of this two-way look up.
I'm going to go
XLOOKUP,
double click,
look up what?
I want to look up the quantity.

And because the formula is in the way,
I'm going to go to this 70
and then use the up arrow to get
to the sale that I want.
And you see in the formula,
it shows add quantity.
That's the column that the formula's going to look at.
Comma,
Look up array.
Where do we want to look for that number?
Want to look for it here.
And then again, F4 to lock it down.

Comma,
return array.
Now watch this.
We have to capture this intersection.
Okay? It's got to be as wide as those tops.
The 1, 5, 20, 50.
Okay?
And then going down the side.
Okay, we've got the intersection
and again, we have to lock it down with F4.
Comma, if not found,
I'm not worried about that.
Comma, match mode.

We want the exact match or next smaller item.
So if I order 33,
I get the discount that goes with 20.
If I order 9,000, I get the discount
associated with the 50.
So I want to put negative one.
Okay.
Now, the formula has done something funny
that I have never seen before
but it is still here.
It's squeezed itself down into the column for some reason.

But I can continue on.
I'm going to close parentheses
that closes the second XLOOKUP.
Now I'm going to hit parentheses again
to close the first XLOOKUP and enter.
Look at that.
Now let's check out what we've done.
We ordered one curled axle
and there is no discount on that.
Okay, we see
we order one,
we've paid full price: the $10.80.

Let's look at the Norton.
We ordered 70.
70 Norton's gets the 35% discount,
which is the 0.65.
Now let's go ahead,
calculate the cost and then we'll be done.
Okay.
Equals
the price
times the quantity,
times the discount,
and enter.
Double click this to widen it out.

We can see. Check that out.
We have to pay $439.08
for the order of 70 Nortons.
And one thing, as a bonus,
I'll show you this.
I'm go to table design while the cursor is inside the table.
And I'm going to go to total row.
Look at that.
And that is the total of our order: 610.58 Euros.

And there is an example
of A two way lookup
nesting an XLOOKUP inside an XLOOKUP.`,

  "Approximate and tiered matches": `In this video,
we are going to do what you may have heard of
as approximate matches.
But they're really tiered matches
are where assigning a record to a category.
You'll see soon.
The bottom line is we have to do matches
where we don't have exact matches.
In this example, we are looking at videos, they're length,
and assigning them whether they're extra short,
medium, extra long, whatever.

So a video that is one hour up to an hour 55 minutes,
that's considered extra long.
And if you've seen the VLOOKUP video,
you should know that VLOOK has to look right.
So I cannot look for this length over here,
and bring up something from the left.
So here's what I have to do.
I'm going to just switch these columns.

All right.
And then I'm going to put this into a table.
Format as table.
Let's see.
We can go with this black color.
Yep, the table does have headers,
and get rid of those filter buttons.
Okay, let's also put this data into a table.
Format as table.
Let's grab this navy blue.
All right, get rid of the filter buttons.
Okay, widen this column a little bit.
Just so we can have some room.

=VLOOKUP.
Double click it.
Lookup what?
Lookup this video length, comma, table array.
I'm going to highlight the values in this table.
And see, it says Table3 there.
Comma, which column do I want to bring back?
I want to bring back the second column.
Comma, do I want an approximate match or an exact match?
I want approximate.

So I can type True.
I can type 1.
I'm going to type 1 there.
Close parenthesis, and Enter.
Look at that.
Now let me go ahead and center these,
so that they're easier to see.
Okay.
Also with VLOOKUP,
the lookup array had to be sorted ascending.
So in that length column in column G, we start with zero,
and go up to an hour 55 minutes.

And let's check.
Is that second video on cooking?
Is that a short?
It's 10 minutes and 50 seconds.
Yes.
The 10 minutes and 50 seconds is between five minutes 30
and 15 minutes even.
So it is a short movie, right?
Let's look at XLOOKUP.
Now notice some things about our data.
The length is all the way on the end,
and that's what we want to lookup,
and bring back something on the left.

That's going to be fine with XLOOKUP.
Also, the links are out of order.
In this situation, I want the Curator column sorted.
So I'm saying, please, will you get these matched up,
but don't resort the data in G, H, and I.
Here we go.
Cursor's in that data set.
Format it as a table.

Let's grab this purple.
It's always a nice vivid color.
All right, and I'm going to do this one purple as well.
Okay.
Get rid of the filter buttons.
Here we go.
=XLOOKUP.
Double click, lookup that value, comma, lookup array.
Lookup the length, comma, return what?
Return the Category.

Comma, if not found, we not worry about that.
Comma, the match mode, exact match, our next smaller item.
So I want -1.
Close parenthesis, Enter.
And we can take a look.
This panel discussion at three hours and four minutes,
30 seconds is extra, extra long.
Yes, that matches our criteria,
because it is greater than an hour 55 minutes.

And the product review at nine minutes 33 seconds
is considered short.
And yes, shorts start at five minutes 30 seconds.
And medium starts at 15 minutes.
So yes, that product review is considered short.
So let's look at one other thing.
We are looking at IDs.
And we want to get people assigned to a day.
So Abigail, the ID starts with V.

T starts the Friday assignments.
T, U, V.
So Abigail should be on Friday.
And notice the IDs in column F are out of order.
A is second, when that's the first letter of the alphabet.
But we want to look at the training days
in chronological order.
So let's look at the data some more.
Danielle, her ID starts with C.

That's between A and G.
Therefore, Danielle should have Wednesday.
Nadia Lynn, that ID starts with 3.
Okay, so that fits in the catchall of going on Tuesday
along with Rob, Esperanza, and Curt.
Okay, let's make the XLOOKUP that can deal with letters,
and not just numbers.
Here we go.
=XLOOKUP.

Double click.
And notice the lookup value is in a string of text.
So here's what I'm going to do.
I'm going to go left, open parenthesis.
That text, how many characters, comma, 1, close parenthesis.
That's my lookup value.
Comma, where do I want to look for that letter?
I want to look for it in this ID column.

Comma, the return array.
I want to return the day.
Comma, if not found, I'm going to put Tuesday.
Double quote, comma, match mode.
Here again, exact match, our next smaller item, -1.
Close parenthesis, and Enter.
Yep, Abigail was assigned Friday.

Curt, Esperanza, Nadia Lynn, Niles, Rob, all have Tuesday.
So look at one more, and then we'll be done.
Evram is assigned Wednesday.
ID starts with an E.
E is between A and G.
And yep, he should have Wednesday,
and that's what Evram has.
So those are three examples of tiered
or approximate lookups.`,

  "INDIRECT": `The indirect function.
On its own, it doesn't do a whole lot,
but you will find some value
in this if you have to do summaries
or need truly dynamic solutions.
In this data set, we have a whole lot of colors.
Now, if I go to C6, all right,
and I'm going to type equals F14 and enter,
we get teal. Okay?
Equals G four enter, raspberry.

But now indirect equals indirect,
open parentheses, and there is an F in C3.
I'm going to put an ampersand
and then grab that 14, close parentheses enter.
Look at that. Indirect allowed me to take the pieces
of a reference and put 'em together
and treat 'em as if they were a single reference.

Let's go to H11, brick red.
Okay, over here we have a summary page that we would like.
We've got the location of St. Orange in cell C3.
We want the person who's in charge of classroom operations.
We want to grab some calculations and data.
Let's look at the data.
Over here we have City Center, that's the name of the tab.
And then I click inside the table for the table design.

That's called City Center.
One thing to note, table names cannot have spaces in them.
We can use underscores.
And so that's why I don't have any spaces
in the table names.
It just makes things a lot simpler.
Okay, let's go to Asterisk City,
click inside the table.
It is called Asterisk City.
We've got the manager, assistant manager
classroom operations, and the location.

That's Asterisk City.
And then let's look at St. Orange
Here is all of the information there.
The table name is St. Orange.
No spaces, no periods, hashes on the lines, et cetera.
Now, let's go back.
I would like to change the location in C3
and have everything update.
I'm going to go to classroom ops
and I am deliberately not going to grab the person
from St. Orange.

I'm going to go equals and let's say City Center
and that person is Fish.
Go back to that sale.
And here is what we want to do.
We want to get rid of City Center.
We want to keep the exclamation point, B3.
Now that exclamation point in the formula means
that it's referring to a sheet named City Center
and we wanted the sale B3 in the sheet City Center.

Here we go.
I don't want City Center right there.
I want C3.
Then ampersand and in double quotes,
exclamation B3, double quote.
Now go back, indirect, open parentheses
and then close parentheses.
Enter.
Is Nikki the classroom operation specialist for St. Orange?
Let's go over here.

Yes, there is Nikki.
Good. Let's go back to the summary.
Next, I want to capture the number of workshops,
the total number that was canceled
and calculate a cancellation rate.
I'm going to go to workshops
and then equals sum, open parenthesis,
go to City Center, workshop scheduled.

Enter 85.
Now I need this dynamic.
Go back up.
I'm going to change this.
Instead of City Center, get rid of that.
I want C3
and I want to go back and do indirect, open parentheses.
Now the C3 is there.
Go over, ampersand,
and then double quote for workshops scheduled.

Then go all the way
to the end after the square bracket, double quote.
And then we need another closed parenthesis
to finish the formula and enter.
104 workshops.
And that is for St. Orange. All right.
How many were canceled?
Equals, sum, open parentheses.
I'm going to go to Asterisk City and then select canceled.

Close the parenthesis, enter.
And why I'm choosing the wrong locations deliberately
is because once I hit enter and the formula is in there,
I want the value to change.
And that's my first indication that the formula is working.
All right, go back to the formula.
And I think you know what we need to do.
I'm going to go here inside the sum, hit indirect,
open parentheses.

I don't want Asterisk City.
I want cell C3.
And, and then double quotes.
Go to the end
between the square bracket and the parentheses.
Double quote.
All right, so now instead of the eight, we have the 10.
Let's make sure in St. Orange...
Boom, exactly.
10 were canceled.

Let's go back to the summary.
Now the cancellation rate equals the 10 divided by
the 104, enter.
Let's turn this into a percentage.
Let's increase the decimal places.
And one last thing in E7,
here's something pretty slick.
Taking advantage of the dynamic arrays
and the new calculation engine, equals C3.

Enter.
Well, that's just St. Orange.
I'm going to go back here.
Put that in an indirect.
Open parentheses, close parentheses, enter.
Now we've imported the entire table
that's named St. Orange.
And then we can go here.
Asterisk City, no spaces,
and enter.

And those are some examples of how you can use indirect
for truly dynamic integrated solutions
in your Excel workbooks.`,

  "Use Alt+Enter to make formulas more readable": `Here's something that you can do to bring some ease and calm around complex formulas. Now let's look at this data. There's the compensation agreement, pay hours at a given rate up to 40 hours. The rate is in I1, that's $45.70. Time over 40 hours is paid at 1.5 times the rate.

Got it. And if a person worked at least 35 hours at central or west locations, then pay the add rate. Let's look at Friendly. Friendly worked 51.5 hours at Central, so that means Friendly should get the add rate of $115. Friendly should be paid 40 hours times $45.70 cents and an additional 11.5 hours at time and a half.

Okay, and we have the pay column with everything calculated. Let's go here. We've got a lot of at symbols, if statement, X look up, dollar signs, plus signs. A lot of stuff is going on in this formula. I'm going to peel it down. Okay, the first part up to this plus sign. Let's see, if hours greater than 40, and then 40 times the rate.

Okay, so it's checking to see if the hours are over 40. All right, so here is the juicy part. I'm going to hit Alt + Enter. Oh, what happened? Look. I am going to open the formula bar a little bit more, and that is what is so exciting about this. Now, I have that one section by itself on its own row. But the formula still works.

I have not put a space in here or messed it up in any kind of way. So let's continue to look. Hours minus 40 times 1.5, okay, so that's where it's calculating the overtime piece. So I'm going to go over here to this plus sign, hit Alt + Enter. Now, what's next? Should I just leave it like this, or is there another way that I can split this? Let's look. If the hours are less than 35, then zero.

Otherwise look up the location. So that's what this last piece is doing It's looking to see that third part of the compensation agreement. If a person worked at least 35 hours at Central or West, then pay the add rate. So this X lookup is doing that work for us, and we could split it down a little further. Go back here and then Alt + Enter, and then I can hit enter.

Good. All right. Now you see that all of the formulas have this same format. You can click on any sale in that column and see the formula all split out. Let's do one other thing. Let's do this. Let's say that Simon worked two hours at West. Okay. $91.40 cents is what Simon is due for those two hours of work.

No overtime, and did not work at least 35 hours at Central or West. And let's look at the formula. The formula is all split out using Alt + Enter, making it easier for me to read. Say if I wrote this today, and I want to be able to look at it in the future and make sense of it or if I pass it off to somebody, they won't freak out by some long, long function, full of parentheses, at symbols, multiplication brackets, et cetera.

Remember Alt + Enter.`,

  "Formula vs. lookup table": `When you're working with Excel and data, there are multiple ways to achieve a task and that means you have some decisions to make. In this video, we are going to look at writing a single formula versus using a LOOKUP array. In this dataset, we've got information about these available apartment units, the rent. And then in this Floor column, I have a formula that peels the floor away from the unit value.

And then in the Layer Formula column, I've got a nested IF. Actually, two IFs nested in a larger IF. Let's look at it. I'm going to go over here and let's do =FORMULATEXT. Ah, see? You learning a new function. All right, here we go. So we don't need to get into the details of the formula, but what's happened is we have all of the criteria that we want.

If the floor is greater than 20, then mark Too High. Then if the floor is less than five, then No, exclamation point. If the floor is less than 10, then we mark Too Low. And that means everything else is floors that we want to live on, and that's why we have the happy face. Writing this formula can be tricky because you have to write the different pieces in a particular order.

You don't want to have it mark anything less than 10 as too low and then stop when you have criteria later that says, "Oh, I want less than five to be No." No, you've got to write these formulas with precision. But, it works. Now, let's look at this formula, a single XLOOKUP, and it's coming off of the LOOKUP range that's over here. We've got a single column for our floors and the layers, but this also means that we need to have room for this LOOKUP array, whether it's on another sheet or same sheet, you've got to put it somewhere.

Let's look back over here at units. In the single formula, they can be great if the data is not going to change much or change at all. So if we don't want to change the parameters, if we're okay with five, 10, and 20 being the most important floors, great. But if we want to change something, ah, we decide that we want, say, 25 to be too high.

Okay? And then if we want to go into the formula, we've got to go in and be very precise about 25 being the new barrier. But you can do it, okay? But now, this gets a little bit tricky. If I want 36 and above to be Way Too High, Enter. That was an easy change to make.

Now we've got Way Too High here. And yes, you can go into the IF statement and add another IF, but you also have to put it in the right place in that formula. And it can be done. It's not egregious if you were to do that. In my past, I have nested 25 IFs inside of an IF. The formula worked.

It was at a time when I didn't know much about Excel and different options, but that IF statement worked. It worked in that situation, given the task ahead of me and the skill that I had. And now, I leave it up to you to determine your tasks, your skill level, your situation. Do you nest a bunch of IFs together or do you use a LOOKUP array?`,

  "Formula vs. helper columns": `When I was thinking about this course, Advanced Functions and Formulas, I figured I didn't want to just show you exotic, obscure functions or wild formulas. I also wanted to give you some strategy. In this video we're going to talk about writing formulas versus helper columns, and you need to be able to decide based on your skill, your comfort, the situation, all of those will dictate whether you use helper columns or formulas.

In this situation, with all of these meeting spaces, from 37th Avenue down to The Triton, we want to calculate the square meters for all venues that have both Wi-Fi and a projector. For other venues we want those to stay blank. So, City Center Q, it doesn't have a projector so we do not want square meters filled in for that venue.

All right, let's go to the Helper Columns tab. So, we had used helper columns for intermediate steps towards our goals. Let's get started here. Go here, say Wi-Fi or a projector equals COUNTA, open parenthesis, I want to count here, all right? The Wi-Fi and a projector, we do not care about 24-hour access.

Enter, so we know City Center Q has two, Licorice Mill has none. Next, over here, let's say feet one, okay, equals TEXTBEFORE, what text? This text, comma, what's the delimiter? TEXTBEFORE what? Before, in double quotes we have to put the x, and then we can close the parentheses and Enter.

So, now we have, we're at 50 feet for Lees Courtyard, but also we have to make sure that this is math, okay? Because we're going to multiply it. So, let's do feet two, okay, equals TEXTAFTER. Okay, which text? This text, comma delimiter is the x, put that in double quotes and Enter.

Now, square feet equals the 31 times the 12, Enter. All right, we're getting there. So, now we have to do the square meters, go back, equals CONVERT the square feet comma, so I'm going to drag this down.

Okay, so there is square foot, double-click. That's the from unit, comma to, we want square meter, double-click and Enter. Now we have our square meters, and that's what we wanted. We've got one more thing to do. We want blanks where there is either no Wi-Fi or no projector.

Now we have to go back into CONVERT, equals if, open parenthesis, this value is less than two then double quote, double quote for stay blank, comma go ahead and do that conversion calculation. Go to the end of the formula, closed parenthesis, Enter, and then let's verify.

Our calculations are in the right place, our blanks are all in the right places. All right, let's look at a formula way to do this, equals COUNTA open parenthesis, highlight here, closed parenthesis then two. Now I'm going to go back to that first cell, go to the formula, equals if this COUNTA is less than two then stay blank.

Otherwise, now it's going to get hairy. All right, take a deep breath. Text, let's do TEXTAFTER, which text? This text, comma double quote x double quote, closed parenthesis for the TEXTAFTER times TEXTBEFORE. Double-click there, same text comma the delimiter double quote x double quote, closed parenthesis.

And I am going to close the if statement and Enter. Oh, look at that. But we aren't done because this is the square feet not the meters. All right, let's compare. Okay, we need 34.55993. Okay, now we have to be careful about how we go back into this formula.

I'm going to go here before the TEXTAFTER, and I'm going to go CONVERT open parenthesis. CONVERT what number? That is the number, going to go all the way to the end comma CONVERT from square feet, okay, double-click, comma CONVERT it to square meters, double-click, closed parenthesis and Enter.

We got it. We got it, got it, got it. So, now we can compare. The big formula we don't have a lot of extra columns, but if something is off we need to troubleshoot this. Somebody else needs to troubleshoot it, this long formula can be intimidating. Now we go over here. Now, yes, we have all these extra helper columns, but we can see what's going on.

We can see that this 372 came from the 12 and the 31, we can see the 50 times 40 1/2 made up to 2,025, and we see that this is blank. We can see all of the individual pieces, makes it easy to troubleshoot. But maybe you're good enough to where you don't need all of these.

Maybe you can build formulas like this, and you'll never pass it off to anybody who will need to modify this or troubleshoot it. It depends on your situation, and that's how you decide if you want to make really big formulas or several helper columns. It's up to you.`,

  "Build complex formulas in steps": `Let's talk about building solutions. What we want to end up with is a value in F1 that says how much each person has to pay for this skydiving trip. In column B, there's a list of friends who have said they're interested in going, and then we have Clayton, Jaz and Saeed have paid a deposit. Everybody's going to split the cost of the van, and that's $111 and 84 cents. And then we need a skydiving total.

So, let's look at the skydiving pricing. It's $300 for each person. Or, for a group of seven up to 11, it's $270. A group of 12 to 15 will pay a flat rate of $2,999. Now how do we approach this, given some of what we've seen previously in the course? We could write a really big formula, helper columns, Lookup arrays.

Let's see one way of going about this. So first, put this data into a table, formatted this table and let's grab this dark blue. Table has headers. Okay, get rid of the filter buttons. Okay, now I'm going to go over here and do a friend count equals count A.

And I'm going to count the non empty sales in this column. So, we have so far, three friends. I'm going to bold this. Alright, let's see. Van per person equals the van rate divided by the friend count. Now how do we deal with the skydiving? Okay, I'm going to slide this out of the way and I'm going to set up a Lookup array, count and then price.

So, one friend, $300, so I have one person. And then at seven, we start at $270. And then at 12, we have equals 2,999 divided by the friend count equals.

And I'm going to put this in a table. Let's go with the blue. I don't want to get too exotic here. Next, the skydiving, total, scrap. This sale equals XLookup, double click, Lookup value the three comma, Lookup array. Look for the three in that count column, comma, return the value in the price column.

We're not worried about if not found. And the match mode that we want is negative one for exact match or next smaller item. Now, enter. Now we have our cost per person. We do this equals the 300 plus the 37.28 and enter. Wow, that's some exciting stuff. Don't you think? I'm going to to boost this up.

Yeah, 'cuz it looks so nice. All right. You know when you do some work and you get things working, that's working right, wow. It's invaluable. You got to celebrate it. I'm going to move this up. Okay, just so we can see, okay, now, Art is in, officially. Look at that. Everything updates, I'm going to undo that. So, it went from 337.28 per person to 327.96.

Okay. And then, Yumi paid. See, the friend count updated. The van price has gone down per person. Mitsuru is in, Magda is in. Ayofemi is in. Panik. Reese, Roy. We've got 11 friends and now we got last call and LP is in.

Now we've got 12 friends and Nathan is in and we can't take anymore because we just got to get going at some point, heading to the van. There you have it. Building a complex solution. And we do have some advanced formulas going on but really, it's about the thinking. We don't have anything really exotic in here but it's the thinking so that you can see what you have going, see that everything is updating properly, adding properly.

But you could, if you wanted to go into cell F1 and start writing one big monster formula. But I'm not. No, I'm not doing it.`,

  'Writing formulas for "future you"': `Something important to keep in mind when you're writing formulas. Okay, you can write really big, complex formulas. They will take up one cell. There won't be a bunch of helper columns or things hidden in hidden columns or rows or on other sheets. The challenge is when you've got this big maze of functions and parentheses, in six months or two years will you know what you did? That is something that's bitten a lot of developers and Excel users.

You write this really exciting formula and then you think back, what did I do? Why did I do it that way? But if that's not a problem, okay, fine. But think about it. Think about whether you want a big monster formula or do you want several helper cells or helper columns that will be easier to understand later, they can be easier to troubleshoot.

Also, think about who else might use this workbook. It might get passed on when you get that great promotion, and start doing other exciting things with Excel. That other person needs help understanding what you did. So keep that in mind. Do you want big monstrous formulas or do you want to break 'em down into pieces? It's your choice.`,

  "Compatibility functions": `So let's say that you are inquisitive, and you have gone into Formulas. Okay, and there are all the categories of formulas, and then you go here, More Functions, and then you get Compatibility. Okay, so in Compatibility, beta distribution, floor, forecast. There's a lot of functions here.

Also, if you were to go and do something like this. So you say equals, rank. Oh, now you see that little triangle by rank, and also by percent rank. They are letting you know that these are compatibility functions, which means they exist in Excel today only for compatibility purposes with any old yesteryear functions that are still using rank, percent rank, et cetera.

It's also strongly suggesting to you that you use something else. So, I'm going to show you three compatibility functions, and what they do. Let's escape out of there. All right, so, rank. We have values over in column B and I want the rank, so equals, rank. All right, I'm going to pick the compatibility version, double-click it.

The number, wanted to grab the number 50, comma, the reference. That's the values that we want to find the 50's rank in. And I'm going to hit F4 for the absolute cell reference. Order is optional. You can put in a one or a zero depending on whether you want it ranked ascending or descending. So right now, I'm going to hit Enter. Now, 50 is ranked first, okay? Send this down.

Okay, so there are the ranks, and you see we don't have a second place. It goes one, one because 50 is tied, and then 38 is third. Now, equals, rank. Equal, all right, the number, comma, the range, F4 to lock it, and Enter. Send it down, okay, those are the same.

Now here is where it's different. Equals, rank average, the number, comma, highlight the range, F4, and Enter. Now, you see. It's giving us the average. The two 50s are ranked 1.5 each. The two 25s are 6.5 each. So, rank EQ does what rank does.

But we have rank average for when you need that. All right, let's look at mode. Mode will tell you the most occurring value in a data set. Okay, equals, mode. Let's pick the compatibility version. And now we need the number, and we've got the donations, right? Okay, that's what we want to look at, and Enter.

Okay so, 100, it's telling us is occurring the most. So let's go in here and sort this descending. Go to Data and Sort. Okay, so we've got two 100s. Okay, mode single, equals, mode, pick mode single, and the data set, and Enter. Okay, we've got 100 again.

Let's look, this is going to be exciting. Mode, we want multiple. We want the data, Enter. Now see, mode multiple is taking advantage of the new engine behind Excel that can bring back multiple results. And now we see, no, 100 isn't necessarily the most occurring. We got two 100s and we also have two 20s in the data set.

Okay, so now, we've got another 55. That's showing up as well. So I'm going to center everything, okay. All right, a 13. All right, so that's important to know because if we only had the 100, that would misrepresent what the whole data set looks like. But then, if I say I've got another 20.

Okay, now they all say 20 because 20 truly is the most represented value in this data set. Right, let's look at one more compatibility function, concatenate. Now, concatenate lets you string together values from multiple cells. So if I want to take this contractor data, equals, concatenate.

Okay, I'm going to double-click there. Now I want Martin Brookings, St. Louis, Missouri, available, and Martin's rate. What happens if I do this? Enter, they're not all together. I would have to do something different to get 'em all together. I would have to say equals, text join, double-click, and then I can add delimiters. What would I want as a delimiter? Let's say I want in double quotes, space, colon, space, double quotes, comma, ignore empty.

I'm not so concerned about that, comma, and then the text. Enter. All right, so everything is in one cell, and it's all together, concatenated. But I used text join to do it. But now, watch what concat will do, equals, concat. Okay, I'm going to open parenthesis. Now look at this text that I have.

It was a paragraph that came out of a PDF, highlighted, pasted in, and it pasted in on individual rows. I want 'em all together. Highlight all of it. Uh oh. Enter. Wow, it is all in one cell now. Beautiful, and then I can wrap text and there it is all in one cell because of the concat function, the replacement for concatenate.

Alright, so those are three of the compatibility functions. You know what they are now, and the idea is you're not supposed to use them. You're supposed to use the ones that replaced them. Concat instead of concatenate, pick mode single or mode multi for mode, and pick rank equal or rank average instead of rank, right? Compatibility functions.`,

  "Writing 3D formulas": `3-D formulas, they can simplify your life, immensely, if everything is set up right, and let's take a look at that. We want to make an overview tab, and that's where we are right now, and we've got these other five tabs. Let's look at 'em. Trip one, we've got gas, that word in B2 and then the amount that was spent on gas in C2, right? Gas, lodging, destination, days.

Go to the trip two tab, same order, everything starts in cell B2. Good. Trip four and then trip five. Right, let's go back to the overview. Now it is time. No more waiting. 3-D formula, I want a total of the number of days equals sum open parentheses, go to trip one.

I'm going to hold down the shift key and go to five. Okay and I want the number of days. I'm going to select C5, enter. 43 total days. So look at that formula. So we are doing a sum of cell C5, and then we look at trip one colon trip five. So we've got everything in the middle.

Let's get the amount that was spent on lodging. Equals sum, open parenthesis, trip one, hold down the shift key, trip five, lodging, enter. Great. Now I'm going to drag this down. We want the amount spent on gas. Gas is in C2. Go back, change this to C2, enter, and then the destinations.

Let's look here, destinations, that's C4 on all of the sheets. Drag this down here, change this to C4, enter, and that's not $46. That is an integer. Change this to number, reduce the decimal places. Great. So now we did a sum. How about we get the maximum number of days that was spent on one of these five trips.

Equals max, open parentheses, trip one, hold down the shift key, trip five, days, enter. 15 days was the maximum. Let's verify that. Trip five. So there was eight days, four, 15, four, 12.

If this had been 29, enter, go back. See, it says 29, but that's not right so I'm going to undo that, go back to 12. Great. When I wanted these sums, I did not have to go equal sum, open parentheses, and then go to every sheet and select the cell on each sheet.

By using a 3D formula, I captured everything. This could have been 20 sheets long. It would've been just as easy.`,

  "Volatile functions": `Before we get started, I'm going to do this, =now, and then open parentheses, closed parentheses. That's telling you that right now it is the 7th of January, 2023, and it is now 6:23 PM. Okay, let's set that aside. This video is about volatile functions. You have to be aware of them. A function is volatile when it recalculates with every change in a workbook.

And here's the list of volatile functions; indirect, offset, rand, randarray, randbetween, now, and today. Now over in column's I through M, I have student count, need to fill in the data, and maybe I need to make some fake data for a tutorial. All right, so I'm going to use =randarray. Okay, I want seven rows of data, comma.

I want four columns representing the quarters, comma. What's the minimum? Let's say I want 35 to be the minimum, comma, the max, 205, comma, and yes, I want it to be an integer, so I'm going to put a one at the end, close parentheses and enter. Now, do you see that I have the blue line around the data and that shows that it's a dynamic array.

One formula made all of that data. But did you notice, over in D2 where I put "now" it is saying that it is now 1825. It recalculated when I changed the data in this workbook, but now I've got my fake data and I want to show a colleague how to write a sum. So I'm going to go here, sum, and go over here. Oh, everything's updated again.

Now I'm going to hit the key F9. See everything updates, F9 again, everything updates. So if I want to show my colleague about how to write sums and I need fake data, I would highlight this and wait for that four-way arrow and then right-click, slide, slide. Let go of the right mouse button and then copy here as values only.

Now, D2 updated. Now if I hit F9, the sale in D2 updates, but the data that I made no longer updates. You need to know about this for a couple of reasons. One, because these constantly update. If you have a lot of them, they can slow your workbook down. They can slow down the recalculation rate.

And what is a lot? That's hard to pin down, but one time I did have a workbook that had about 40,000 volatile functions in it and that sometimes caused the workbook to crash. Many of us will never work with that amount of data. So if you want to use an indirect, or an offset, and you've got 20 of them, maybe 50 of them, it's probably not going to hurt you.

You just need to be aware. You also need to be aware with randarray, rand, randbetween. You've got to get rid of the underlying formulas or everything is going to keep changing. And now, with the now function and the today function, what you have to watch out for there is if you've made a calculation based on today, say, how many days did it take a group of tickets to get rectified? And you base it on today, and you wind up with say, 17, 19, 50 days, and you save the workbook and you come back, all of those are going to recalculate to the new day and then your data is going to be wrong.

But then there are situations where you do want your today function to update. Say if you're looking at deadlines that are out into the future and you want to look at how many days are left between today and those future dates, you might want to leave that today function as a live function. So, those are some of the things that you have to think about and be aware of when you deal with these volatile functions.`,

  "LET function overview": `The let function in Excel is pretty new. And it forces us to think in a different way. But yeah, it's got some serious benefits. But one thing you have to be aware of, it forces us to think in a different way, because we can put variables and calculations in a single formula. And that's also a benefit. So let's look at this. I want to figure out how much gas is going to cost for a trip.

So I'm going to go equals let, open parentheses. Name1. Gas is going to be Name1 R, our first variable. Comma, what is the value of this variable called gas? It is right here in C3. Comma. Now I can do a calculation, or I can do another name or a variable. I'm going to go distance, D-I-S-T.

Comma, that's my next variable. Now I need the value, where will it find the value for this new variable right here? 1300 miles. Comma, am I ready for a calculation, or do I need a name? Do I want a calculation here or a third variable, I want a third variable. Miles per gallon, MPG. Comma. Now it's askin' for name value three. We find the value for MPG right there.

Comma, now I'm ready for the calculation. Gas. Notice that this is available for me to click on, because I set it up as a variable in my let function. Okay, I can click on it or I can just type it out, so I've already typed it out. Next I need to divide by MP, look at that. There it is, I'm going to click on MPG, that's my variable. Boom. And I have to multiply by the distance, DI, look at that, I've got distance there as an option for me.

Close parentheses and Enter. This trip should cost about $303.11 in gas. And then we can change. Ah, okay. My sister is going to let me borrow her car that gets 27 miles a gallon. Boom! Oh, look at that. Alright. Are you ready? Okay.

Look at this. We have to go out and do some work. Whatever this is. We've got Monday through Saturday, and we have everybody assigned to shifts. Everybody's going to get their own room, and those are going to be $720 each for the time we're there. There's a shuttle that's going to cost $800. And then we're going to take everybody out to a fancy dinner, and in G6 through H10, that is the grid for calculatin' the dinner.

Here we go, equals let. Now, let me warn you, we got to pause, 'cause this is going to be quite involved. Let, okay. ECount. Comma, where am I going to find the value for the number of people that are going? Now look at this data. Stork is in here twice. Angela is in here three times.

Felix one time. Pablo is in here twice. Okay, so we don't need the tally of the slots. We need to get the number of people without all of the duplicates. Okay. I'm going to go tocol. Open parentheses The array that I want to turn into a column. Close those parentheses. Go back to the front of tocol.

Now I want unique. Open parentheses And then close parentheses. That will give us the list of the unique names. And if you need to go back and look at the videos on tocol and unique, please do that. Next, I want to get the count of unique names, Count A. Open parentheses, go to the end, and close parentheses.

So that is the value of the ECount. So I'm going to hit comma, and then, let's do this, let's look at it first, Ecount. Double click there, close parentheses, and Enter. So it says $12, because the cell is formatted as money, but it's really meanin' 12 people. So let's push on forward Because now we need, let's see, shuttle.

That's the second variable. Comma, we find shuttle here. Comma, next name. Dinner. Comma. The calculation for our third variable. That is going to be X lookup. Double click the X lookup. Look up value, watch this, I'm going with E. Count. Double click, I don't have to calculate that again.

Comma. Look for the ECount where? In that column. Comma, return the price of the fancy dinner. Comma, I'm not concerned about if not found, comma, match mode, I want negative one. Close the X lookup. And I'm going to open this formula bar up, okay. Now, comma, I want a variable.

Rooms. Comma. And here is the value. Comma. Now I'm ready for the final calculation, and this is going to be a real thriller. Okay. Shuttle, plus, in parentheses, dinner. Double click it.

Times ECount. We need that because when we did the variable we got the price per person, now we have to multiply it times each person who's goin' on this trip. Close those parentheses. Now we've got the shuttle plus the price of the dinner. Now plus, open parentheses, Ecount, double click, times the price of the rooms, so rooms.

Close parentheses. Okay, we have done a lot. So, are we ready to hit Enter, and see what happens, and hope that no error messages come back? Here we go. Three, two, one, Enter! Doesn't it feel good when this goes right? The price of this is going to be $10,280. And that is right.

And now we found out that Daniel cannot go, and Graciela is going to take Daniel's place. Enter. Everything updated. One thing we can do with the let function, let's go back here. So open this formula bar up some more. So we see, okay, right here the Ecount, I'm going to hit Alt Enter. And if you haven't seen it already, you should check out the Alt Enter video, that'll help you see what I am doing here.

Alright, so we've got the ECount variable. Now I'm going to hit Alt Enter, shuttle, and then dinner, Alt Enter. Need some more room, we did a lot of work. So the dinner was calculated. Okay, then we have the rooms, Alt Enter. The room variable is in H3. Go here, Alt Enter. And there is the calculation.

Lookin' at the formula this way it is clearer to see what's goin' on. And if you had to make any modifications to it, add any variables, change a calculation, you can do it. And one big thing that I hope you picked up was we used ECount three times in this formula, and we only had to calculate it once.

That's big. Without let, we would've had to use maybe helper columns or some way to peel this data down to then get a variable, and then write formulas that reference that cell. Or, write a really big formula that calculates the ECount three separate times so that it could be used three separate times. Also, by lookin' at the formula this way, you can see the variables and where the calculations came from.

If you want to know how did you calculate ECount. Alright, there it is, we had a tocol wrapped in a unique wrapped in a count A. And where did the rooms variable come from, well, that's in cell H3. And how did you calculate the dinner? Well, first of all, we did an X lookup, right there, and then we multiplied the dinner by the ECount. Let is some powerful stuff. So, play with it, get to know it.

See if, in the type of work that you do, see if let can be of service to you.`,

  "Error handling: IFNA and IFERROR": `Let's look at some error handling. In a previous video, I did show you an XLOOKUP that there is a component for if a value is not found, what do you want XLOOKUP to bring back? That component is also an XMATCH, but let's look at some more basic things. Starting in B3, I have a list of gift cards and I'm suspicious.

So this handful, I want to check to see if they're legit. Go equals, MATCH, double click, look up that gift card, comma, look it up in this column, comma, and I want an exact match, so zero. All right, so that six says it's in the sixth position in the column. Now, I'm going to send this down.

Okay, so we've got three that were not found in the list. I'm going to wrap this. Go back to the first one, wrap this in IFNA, open parentheses, all of that match, that's the value, comma, IFNA, then fraudulent, close the IFNA parentheses, Enter. Go back, double click.

There we go. And we can even center 'em so that we can see. So that's one way of handling values that aren't found. Now, let's look at something else. Cell F3 says that we earn 2.22% on gift cards sold. And we go down here, look at plain formula. All right, so there's a sum of the gift cards, multiplied times of value in F3. All right, and that is just the plain math.

And then, all right, same formula, but I'm going to wrap this in IFERROR. IFERROR, open parentheses, go to the end, comma, what do I want this to bring back if there is an error? Let's have some fun here. Do window, period, and let's find something sad. Okay, here is a facepalm.

And that has to be in double quotes, double quotes, and close parentheses for the IFERROR, Enter. Okay, no problem, but now, watch this. Highlight that column, right click, Delete. Wow, the plain formula is bringing back that ref error, which usually means there's a formula that was referring to something that disappeared, not just deleted but gone.

And what does IFERROR do, it just shows us facepalm. We don't know what is behind that error. And so, that's why you have to be careful with the IFERROR function because if we were only looking at that facepalm emoji, we might figure, well, maybe we'd figured that there's no money earned. We don't know. But I'm not saying never use IFERROR. There is a place for it.

But you have to look at your situation, understand your data intimately, so that you know whether to use IFERROR, IFNA or use one of the functions that have a not found component baked into the formula. This is up to you and for the last time, I'm warning ya, be careful.`,

  "Challenge 1: Course completions": `Welcome to your first challenge. Haha. This one is going to cause you to think and put in some real effort. So here is data about reps and courses that they took. And they had to do it in a minimum of 30 days or a maximum of 120 days. So the goal is to assign a thumbs up, a broken heart, or a lightning bolt, based on how long it took them to complete these courses.

Now look at the data. Seth took course one in June, ah, but took course two in April. So he took course two first. Course three was taken in August, so they were out of order, but still that doesn't matter. Whatever the time span was, it could not be shorter than 30 days or more than 120 days. And you have to assign the right icons, all right? Time to pause the video, get all of that sorted and calculated, then come on back and hopefully you and I will have the same results.

Okay, let's do it. Alright, so slide this side of the way. So now, too short, I'm going to put a zero right there. Too long, I'm going to put 121. And okay, that's 30. Okay, so days, icon, and put that as status.

Alright, I'm going to slide this over. Alright. And I'm going to click there and then format this as a table. Make this blue. Okay. And then I am going to put this as a table as well. Also blue. Okay, get rid of these filter buttons. Now, here is work equals max.

Open parentheses, highlight the sales. And then I'm going to put, let's say enter right now because we just want to look right now. Title that Result. I want to go back to the formula. Minus. Min, open parentheses. Enter. Yes, I forgot the closing bracket. So, yes.

And I want to format this as a number, at least for now, and I'm going to decrease the decimal places. Okay, so now we see Seth took too long. Pip is too short, too fast. Ronaldo is fine, Kurt is fine. Now status, let's call this Status and call this Days.

Okay? And equals X look up, double click, look up what? The 136. Comma, look up array. Here. Comma, return array, return the icons. Comma, if not found we're not worried about, comma, we want exact match or next smaller item. Negative one, and enter.

Hoho, and then center that column so it looks nice and beautiful and let's check this out and let's verify. So for one thing, look at this, Lewis started December 21 and then finished eight months later. Yeah, that's way over a hundred and what, 120 days. And that's why there is the broken heart. Pip, we saw. 22 days too short.

Abraham, Choppa, they're all fine. And then Julio, 123 days. Two days over the limit. Gosh. But the bottom line is how did you do? How did you do this challenge? Hopefully you got those results. And if not, that's fine. If you didn't get these results, you know, these take some effort, you have to do this.

And that's why we are learning and I appreciate you being here, learning along with me.`,

  "Challenge 2: Two-way lookup": `Right, this next challenge asks you to do a two-way lookup. We have a list of these pairs of people who have been assigned these shifts. Day four morning, we've got Erika and Cheryl. So if we wind up with day four in C2, and morning in C3, we'd want to have Erika and Cheryl pop up.

But right now it says day three and evening, create the two-way lookup that will automatically retrieve the right pair.

Here we go. I'm going to put the result right here, and equals XLOOKUP. Double click. Look up value. Day three, comma, look up array.

Look for day three here. Comma, return array. Oh, we got to do another XLOOKUP. Double click. Look up what, evening, comma, look it up, where? In here. Comma, return array is right there. Okay, and close the XLOOKUP. Close the first XLOOKUP and enter Ariel and Bill, can we verify that? Right, so let's change this.

Let's go to day six. Evening, Bill and Taylor are working together. Let's change this to afternoon. Boom. Levi and Lolade. And that's one way of doing a two-way lookup.`,

  "Challenge 3: Guitars": `Amy is a guitar player and a guitar collector. Here is a list of guitars that she's bought and sold over the years. And is sorted by the amount descending. Here's what we want to know. Does Amy still own guitars: F, L, M, or A? If she's never owned one, then return N. O.

Well, let's look at the data. So on the 25th of August of 2013, Amy sold guitar M. We also see on the 6th of June of 2020, she purchased guitar M. We see that for guitar J, that was purchased on the 17th of October 21 and sold the 5th of December of 21.

So, we want to know about guitars F, L, M and A specifically. Does she still own them or not? Right? Pause the video and work that out. Come back.

All right, let's do it. Let's see if your result matches my result. I'm going to go guitar and we're interested in F, L, M and A.

Make this bold. Slide this out of the way and I'm going to put this into a table. Okay. Get rid of this filter buttons. Okay. And in order to do this right I've got to sort the activity, go to data and sort it ascending. Now, equals x lookup, double click Look up what? F, comma, look up array.

This column, comma, return array, the action column, comma if not found, double quote N, period, O, period, double quote, comma, match mode, We want an exact match. Nothing to do there, comma. Search last to first negative one closed parenthesis, and enter.

So the last activity on guitar F was a purchase so we can assume that she still owns that one. And let's see, she never owned a guitar L and even though she had sold M at one point she bought it back and A was purchased.

So she owns F M and A and never did on L. Well, let's verify M before we get out of here. There's three of them. Purchased for $710 in May of 99 and then sold for $1,230 August, 2013 and bought back for $800 in June of 2020.`,
};
