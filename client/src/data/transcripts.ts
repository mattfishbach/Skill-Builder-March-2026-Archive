export const videoTranscripts: Record<string, string> = {
  "Empower your organization": `Cybersecurity doesn't have to be super complicated. In fact, the most powerful strategies are built on core fundamentals, and when you get those right, everything else from advanced threat defense to AI-driven solutions can be so much more effective.

Hey, friends. I'm Nicole Dove. And together, we're about to demystify version two of the NIST Cybersecurity Framework, explore how it's evolved, and learn how to use it in ways that are practical, not theoretical.

I'll bring in real world examples, sprinkle in some humor, because cyber doesn't have to be boring, and give you tools you can actually use to make real impact in your organization. Let's get started.`,

  "Core functions of the NIST Cybersecurity Framework (CSF)": `It's time to dive into the heart of the NIST Cybersecurity Framework 2.0, the framework functions. For brevity, instead of saying NIST Cybersecurity Framework 2.0, I'm going to refer to it as its acronym, CSF. The framework was built to help organizations understand, manage, and reduce cybersecurity risk, and it's not a regulation or a checklist, it's a flexible framework. Think of it like a GPS for your cybersecurity strategy.

It shows where you are, where you want to go, and possible routes to get there. At the core are six functions which organize your cybersecurity activities into logical, repeatable categories. These are identify, knowing what you've got, assets, data, risk, roles, it all starts with visibility. Protect, putting controls in place to safeguard your most valuable resources. Detect, spotting problems fast.

Think monitoring, alerts, and anything that helps you catch threats before they snowball. Respond, having a game plan ready when things go sideways. Recover, bouncing back stronger and smarter after an incident. And govern, which is new to the framework with v2.0. It ties leadership, strategy, and policy into the whole framework, so cybersecurity aligns with business goals. The beauty of these functions is really how they work together.

They create a common language so everyone, from engineers to executives, can understand what is important to an organization's security posture. And this matters because clarity drives action. When you know which function an activity supports, you can prioritize resources, communicate risk effectively, and measure progress in ways that are meaningful for both cybersecurity and the business. For example, say, your team is spending a ton of time deploying endpoint tools, which is a part of the protect function, but leadership is asking about business continuity, which is a core component of recover.

Mapping those conversations to the CSF instantly connects the dots, reducing confusion and building trust. The other big benefit, scalability. Whether you're a small business or a multinational enterprise, the CSF adapts. It's a guide, not a prescription, which means you can rightsize it for your company without watering it down. Understanding the purpose and structure of these functions is step one in applying the framework effectively.

These changes don't just tweak the framework, they elevate it to meet today's threats head-on.`,

  "Key framework updates": `The threats we face don't stand still, so it's imperative that cybersecurity doesn't either. That's why NIST gave the framework a serious glow-up, taking it from CSF 1.1 to CSF 2.0. At its core, CSF 2.0 is about meeting the moment. Here are the most important updates.

One, the new Govern function. This sixth function was added to ensure cybersecurity is fully integrated into organizational strategy and leadership decision-making. It stretches companies to define roles, responsibilities, policies, and to align security goals with business objectives. That means no more treating cybersecurity like a side project in the company basement. Now it belongs in the boardroom.

Two, a stronger focus on supply chain risk. Supply chain attacks have been front page news. Just think SolarWinds or MOVEit. 2.0 of the framework puts a sharper focus on managing risks related to third parties, vendors and service providers, weaving supply chain considerations into multiple functions, because let's face it, your security is only as strong as the weakest vendor password.

If you want to dive more into supply chain security, check out my course, Preventing Supply Chain Attacks, right here on the LinkedIn Learning platform.

Three, more guidance for implementation. One of the critiques of CSF 1.1 was that it was fantastic in theory but sometimes tricky to put into practice, and I'm glad to report that 2.0 is equipped with implementation examples and quick start guides, which make it much easier for organizations to get started, whether you're a small startup or a complex global enterprise.

Four, expanded scope beyond critical infrastructure. Originally, CSF was designed with critical infrastructure in mind, like energy grids and hospitals, but now, its scope is much wider. CSF is more inclusive and can be used across every organization, no matter the industry. Whether you're in finance, retail, manufacturing, or even a new company with less than 100 people, this framework is for you.`,

  "Asset management": `Let me start with the simple truth. You cannot protect what you don't know you have. It sounds obvious, right? But in most organizations, assets are like socks in the laundry. They vanish, multiply mysteriously, or show up in places you never expected. Asset management is about building and maintaining an accurate, up-to-date picture of everything in your environment that could be impacted by a cyber event.

And I mean everything, hardware, software, data, cloud services, IOT devices, even those temporary systems someone spun up for a project three years ago and then forgot about.

This is so important because attackers are constantly looking for blind spots and unmanaged or untracked assets are low hanging fruit. Think of them as unlocked entry points in a house. It doesn't matter how many deadbolts you put on the front door if the window in the backyard is wide open. Strong asset management starts with visibility, and here's what that looks like in practice.

First, identify and inventory, discover everything connected to your network. Servers, endpoints, cloud accounts, mobile devices, applications and data repositories. Automation tools, and even AI-driven asset discovery can make this process way less painful than manual spreadsheets.

Then, classify and prioritize. Not all assets are equal. Your company's crown jewels, sensitive data, core systems and critical applications need more protection than the coffee machine that's connected to the wifi.

And finally, ongoing monitoring and updates. Environments are dynamic and ever-evolving. Cloud instances spin up and down, employees join and leave, vendors connect and disconnect. Your inventory should evolve in real time.

Now, asset management sounds simple, but there are plenty of curve balls, including Shadow IT, those unofficial apps or services teams use without security review and approval. There's also remote work as employees using personal devices or home networks that don't have the same protections as those using company machines on company networks and company offices. And of course, the third party blind spots, thanks to the access your tech ecosystems require by vendors or partners to carry out contracted services.

Ignoring these factors creates hidden vulnerabilities, but good asset management is more than a cybersecurity checkbox, it's a business enabler, and I know, I know, that's a term we hear thrown around quite a bit these days.

So let me justify myself by telling you what that enabling actually looks like. When you know what you have and what matters most, you can better prioritize your defenses, respond to incidents faster because you know where critical systems live, communicate risk clearly to leadership and save money by eliminating unused or duplicate systems. It's like cleaning out your closet. Suddenly you can see what you own, what you need, and what you can toss.

Except here, the stakes are way higher than an outdated pair of jeans that probably don't even fit anymore. No judgment. All in all, asset management is the foundation of the Identify function. It's step one in understanding your cybersecurity landscape and it's essential for everything else we'll cover.`,

  "Risk assessment and risk strategy": `Welcome to the world of Risk Assessment and Risk Management Strategy, the part of cybersecurity where we connect the dots between assets, threats, and business priorities. Because here's the thing, you can't defend everything equally. I mean, you can try, but trying to do that is like trying to guard every single grain of sand on a beach, exhausting and honestly pointless.

Risk assessment is about understanding where to focus. It helps you determine what threats are out there, how vulnerable your systems are to those threats, and the potential impact if those threats become reality. Think of it like a weather forecast for cybersecurity. If there's 10% chance of rain, maybe you bring an umbrella, just in case. If there's a 90% chance of a hurricane, you board up your windows and head inland. The same logic applies here, invest resources where stakes are the highest.

Here's how a solid risk assessment usually flows. First, identify risks. Start with your asset inventory, and for each asset ask, what could threaten it? These could be things like malware, insider threats or supply chain attacks, and also where are the weak points? Then you need to analyze the likelihood and impact because not every risk is created equal.

Likelihood is how probable it is to happen, while impact measures how bad it would be for the business. Next, prioritize, combine likelihood and impact to focus on the most urgent risks first. High likelihood plus high impact, that's your hurricane, act now. Last, document and communicate. Write it all down, and most importantly, be sure to use language that both technical teams and executives can understand.

This might look like saying business disruption instead of unpatched server vulnerabilities. Frameworks like fair or qualitative rating scales can help here, but don't complicate it. A simple, consistent approach beats a perfect but never finished model every time.

Once you understand your risks, you need a risk management strategy, and that's your roadmap for reducing, transferring or accepting those risks. This involves aligning with business goals because cybersecurity isn't just about locking things down, it's about enabling the business to thrive safely.

Defining your risk appetite, how much risk is leadership willing to tolerate? And establishing controls and policies to mitigate the top risks that you've identified. Here's where communication is super critical. You need to translate technical risk into business risk so decision makers can prioritize resources. Remember, our firewall is outdated, might get a shrug, but our outdated firewall puts $50 million in revenue at risk, will get attention.

Here's the reality, risk assessment is not glamorous. Nobody cheers when you finish a risk register, ask me how I know, but here's the upside, without it, you're basically playing cybersecurity Whack-a-Mole, reacting to every alert, every incident and every headline with absolutely no strategy, but a solid risk process turns chaos into clarity.`,

  "Governance and risk management": `Imagine a company facing a ransomware attack. Without governance, chaos, but with governance, calm, coordinated action, roles are clear, policies guide the response, and leadership communicates effectively both internally and externally. And that's because governance doesn't just prevent breaches. It helps organizations respond faster and recover stronger, not if, but when incidents happen.

Cybersecurity isn't just a technical challenge, it's a business challenge too. Governance ensures there's a decision-making framework for how security is managed, who owns what and how policies are enforced. Without it, cybersecurity becomes a game of hot potato with everybody passing responsibility until, oops, the system gets breached. NIST CSF 2.0 emphasizes this with the brand new govern function, signaling that leadership accountability is no longer optional.

We'll break down governance into three key areas: Policies and procedures, role and responsibilities, and leadership and tone at the top.

Policies and procedures are the rules of the road. Policies cover topics like data classification, access control, vendor management, and incident response. Clear written policies provide consistency and help organizations comply with regulations. You can think of policies as guardrails. They don't stop the car from moving, but they will keep it from flying off a cliff.

Everyone in the organization has a part to play, not just the cybersecurity team, and that is where roles and responsibilities come in. Defining roles prevents confusion and finger pointing during incidents. Roles related to cyber strategy could include any of the following: Executives setting strategy and approving cyber budgets, cyber teams implementing controls and monitoring threats, employees following secure practices like reporting phishing attempts, and don't forget third parties, vendors and partners must understand their roles in protecting your company's environment.

The third element of the governed function is leadership and tone at the top. If executives treat cybersecurity like a check the box exercise, so will everyone else. But leaders who prioritize security send a powerful message. This is not just an IT problem, it's a business priority. Governance structures like steering committees and risk councils can help maintain alignment between technical teams and the business, which I am sure you've gathered by now is very important.

Governance, policies and roles bring the identify function full circle. Asset management told you what you have, risk assessment showed you what to prioritize, and governance ensures those priorities are executed consistently and with accountability at every level. Without this final piece, the identify function is like a beautifully drawn map with no one to navigate it.`,

  "Identity and access management": `Back in my day, cybersecurity was like defending a medieval castle. You built thick walls called firewalls, dug deep moats in the form of network segmentation, and hoped the bad guys stayed outside. But today, with cloud services, remote workforces and mobile devices, there is no single wall. The identity of your users, the who, not the where, is the new perimeter.

When you think about a cybersecurity breach, you probably imagine a hacker typing furiously to bypass a company's defenses. But often they don't need to hack in at all. Seriously, they just log in. That's why access control and identity management are the digital equivalents of guarding the gates to your kingdom. If you hand out keys to everyone without tracking who has them or worse, leave the front door wide open, don't be surprised when you find strangers eating at your dining room table.

Every employee, contractor, or even vendor account is a potential pathway for attackers. That's why the protection category of the NIST CSF 2.0 exists to ensure every identity is properly managed, authenticated and monitored.

Imagine you run a venue. Would you give every guest an all access VIP pass? Of course not. Some people only get into the main floor, others into the VIP lounge and only a trusted few can get backstage. The principle of least privilege works the same way in cybersecurity.

Users should only have access necessary to do their job and nothing more. Excessive privileges are like handing out free backstage passes. If an attacker compromises just one account, they can move through your network like a rockstar on tour. So be sure to regularly review and remove unnecessary permissions, especially for high value systems.

Let's talk about authentication, which stated simply is validating that when a user logs in, it's really them, but using just passwords alone, no thank you. With the exponential increase of compromised usernames and passwords being sold on the dark web, modern identity protections incorporate multi-factor authentication, commonly referred to as MFA.

MFA requires users to prove they are who they say they are with at least two forms of verification, like a password and a fingerprint or a password in a one-time code. So even if an attacker steals a password, they'll have a much harder time getting past that second factor. According to Microsoft, enabling MFA blocks 99% of automated account compromised attacks. That's like turning a flimsy lock into a solid steel vault.

But to further complicate the issue, accounts aren't forever. Contractors leave, employees change roles, vendors move on. So if you don't have a process for account lifecycle management, you'll end up with zombie accounts, active logins for people who shouldn't have access anymore.

Remember the infamous Colonial Pipeline breach in 2021? Well, it all started with a single compromised inactive VPN account that never got disabled. One forgotten account caused a national gas shortage. So always deprovision accounts immediately when access is no longer needed.

Traditional networks assume that once you were inside, you were trustworthy. But as we've seen insiders and compromised accounts can do just as much damage as outside attackers. Zero trust flips that model. First, verify every request every time, no matter where it comes from. And assuming breach will help limit the damage through continuous authentication and strict segmentation. Think about it like airport security. Even pilots still go through the security checkpoint.

Next up, we'll talk about data security because once you've secured who gets in, you'll need to protect what they can see. After all, what good is guarding the gate if the crown jewels aren't locked up inside?`,

  "Data security": `Data is often an organization's most valuable asset. It's what drives decisions, creates value, and unfortunately attracts attackers. Breaches like Equifax, Move It and Target weren't just embarrassing, they cost millions, damaged reputations and in some cases even led to executive resignations. Attackers don't want your firewalls or fancy dashboards, they want data, so protecting it is non-negotiable.

There are three sets of data, at rest, in transit and in use. Data at rest is when it's sitting quietly in storage, like files on a server or database. Data in transit is moving like an email being sent, or data uploaded to the cloud. Data in use is when someone is actively working with it, like editing a customer record or updating a document.

Each state requires its own defenses. For data at rest, encrypt files and databases to keep thieves from reading stolen data. To data in transit, use secure protocols like TLS to protect data as it travels, and for data in use, security practitioners apply strict access controls and monitoring. That way, even legitimate users don't go rogue.

Let's talk about data classification because not every piece of data needs the same level of protection. Your company's lunch menu, public, but customer credit card numbers, top secret. Data classification helps you categorize information as public, internal, confidential, or restricted, so you can apply the right level of security. Without it, you risk either overprotecting low value data and slowing down the business, or under protecting high value data and inviting disaster.

You need clear policies that guide how data is handled, stored and destroyed. How long do you keep sensitive records? Who's allowed to move files to the cloud? What happens to old laptops or hard drives? When you couple these policies with training, employees are equipped to know what to do and what not to do.

A well-trained team is just as capable of preventing accidental leaks as effectively as a firewall. Data security is about more than compliance, it's about protecting the information your business and your customers trust you with. By classifying data, securing it in every state, and pairing strong policies with the right technology, you turn your organization into a digital fortress.`,

  "Security awareness and culture": `Your people, the humans behind the keyboards, are your first line of defense and sometimes your last hope. Phishing emails, social engineering phone calls, and fake text messages are attacks that prey on curiosity, trust, and sometimes panic.

Most security training programs are boring, forgettable, and about as exciting as watching paint dry. Employees sit through a generic annual video, click through a quiz, and promptly forget everything they just learned.

To be truly effective, training must be engaging, relevant, and ongoing. Make it interactive with real-world scenarios employees might actually face. Keep it short and frequent instead of one massive session per year. Include stories of real incidents to make lessons stick. When people see how cyber threats impact their daily work, they start to care.

Training isn't just about teaching employees to spot phishing emails. It's about creating a culture where security is a part of every decision. That means your leadership sets the tone by demonstrating secure behaviors themselves. Teams feel safe reporting mistakes instead of hiding them, and security becomes a shared responsibility, not just the stuff that IT or someone else handles.

When everyone understands that their actions have an impact, your organization becomes stronger and more resilient. But how do you know if your training is actually working? Completion rates alone don't cut it.

Look at meaningful metrics, like a decrease in successful phishing attacks over time. You can also look for an increase in reported suspicious emails or activity. And of course, a faster response when incidents do occur is always a good indicator of success. If you see movement in these areas, your program is making a real difference.

Technology can stop malware, block suspicious traffic, and flag vulnerabilities, but it can't stop someone from clicking on a fake invoice or giving out their password to a convincing scammer. Investing in your people through effective training and culture building is one of the smartest moves you can make to reduce cyber risk.`,

  "Protective tech": `We've talked about people, processes, and policies, but now it's time to talk about tools. Even the best trained workforce and the strongest policies can't block every threat on their own. That's what protective technology brings to the NIST CSF 2.0 framework. Think of these technologies like a superhero's gadget belt. Each tool has a unique purpose, but together they form a powerful, layered defense that keeps attackers out and sensitive data safe.

Cyber attacks move fast. In many cases, they're fully automated, hitting thousands of targets in seconds. Humans alone can't keep up with that pace. Protective technologies give you the speed and scale you need to defend your systems. But here's the catch. Buying fancy tools doesn't guarantee security. Without the right strategy, they become like expensive exercise equipment, gathering dust in the corner.

Here are a few must-have tools in a modern cybersecurity stack. As I list these, reflect on your own ecosystem. Do you have a tool in place to address these needs?

The first tool is the classic first line of defense, firewalls. Firewalls control what traffic comes in and out of your network. Next gen versions add smart features like application awareness and threat detection. Think of them as a security card who doesn't just check IDs, but also scans for suspicious behavior.

Endpoints like laptops, phones and servers are favorite targets for attackers. Endpoint detection and response tools, commonly referred to as EDR, watch these devices closely, looking for unusual activity. Extended detection and response, or XDR, goes a step further, connecting the dots between endpoints, networks, and cloud systems to spot bigger patterns.

Intrusion detection and prevention systems act like motion sensors for your network. While an IDS alerts you to suspicious activity, an IPS takes it further by automatically blocking threats before they spread.

Data loss prevention, or DLP tools, keep sensitive data from slipping out of your organization, whether by accident or on purpose.

Network segmentation isn't a tool so as much as a strategy, but it's essential. By breaking your network into separate zones, you limit the damage if one area is compromised.

Now, here's a common pitfall. Buying too many tools. Organizations often layer on product after product, only to end up with overlapping features, alert fatigue and gaps where systems don't integrate. More tools are not always better. The goal is a cohesive, well-orchestrated defense, not a messy pile of sophisticated gadgets.

We can't talk about cybersecurity without covering AI and automation. Artificial intelligence is transforming protective technologies. As attacks get faster and more sophisticated, automation isn't just nice to have, it's essential.

Protective technologies are your organization's shield and sword, giving you the speed and precision to stop threats before they cause harm. But remember, these tools are most effective when combined with strong access controls, robust data protection, and a well-trained workforce, the very things we covered in this video.`,

  "Detecting threats and anomalies": `So you've locked the gates, protected the crown jewels, and trained your people to be security rock stars. Everything seems calm, too calm. In cybersecurity, silence doesn't always mean safety. Sometimes it means the bad guys are already inside, quietly poking around while you sip your morning coffee. This is where the Detect function of the NIST Cybersecurity framework comes into play.

At its core, detection is about visibility. You can't protect what you can't see, and you can't respond to threats you don't know about. The Detect function focuses on continuously monitoring systems, networks, and behaviors to identify potential cybersecurity events.

Think of it like a high tech smoke detector for your digital environment. It doesn't wait for flames to erupt, it sniffs out early warning signs like unusual activity, suspicious logins, or sudden spikes in network traffic. The goal isn't to raise alarms, it's to raise the right alarms at the right time so your team can act quickly without being overwhelmed by false positives.

NIST CSF 2.0 breaks Detect into a few key activities. First, anomalies and events. This is where you figure out what normal looks like for your organization so you can spot when something is off. If everyone logs in from New York at 9:00 AM, a sudden log in from somewhere across the globe at 3:00 AM is definitely a red flag.

Then there's continuous monitoring. Cyber threats don't take weekends off, so neither can your monitoring. Continuous monitoring tools like security incident and event management systems, log analysis platforms and endpoint monitoring, keep a continuous watch over your technology ecosystem.

Last, there are detection processes. It's not enough to collect data, you need consistent, repeatable processes for analyzing that data and escalating alerts to the right people. Clear processes really help with reducing confusion when the pressure is on.

So many organizations fall into the trap of having either no alerts at all or so many that analysts start ignoring them. Neither is good. Effective detection requires tuning. You want to catch real threats early without creating so much noise that your team burns out or misses something critical.

Detection is super important because the faster you detect a threat, the faster you can contain it. Studies show that early detection dramatically reduces the cost and damage of breaches. Detection isn't about preventing every attack, it's about limiting how long an attacker can hide and how much damage they can do. It's like turning on the lights in a dark room. It lets you see clearly, identify risks and prepare for action.`,

  "Incident response": `Remember that smoke detector we talked about? The loud beeping is helpful, but if nobody grabs the fire extinguisher or calls the fire department, you're still in big trouble. That's where the Respond function of the NIST CSF 2.0 comes into play. This function is all about taking decisive, organized action once you've identified a cybersecurity event. The Respond function isn't about running around in a panic, shouting, "We've been hacked!" Even though, sometimes, you really want to.

It's about having a clear predefined plan so everyone knows exactly what to do, because in cybersecurity, chaos is the enemy. A well-structured response turns a potential disaster into a manageable incident. The goal is to contain the threat, limit the damage, and communicate effectively, while staying calm under pressure.

NIST CSF 2.0 breaks Respond into a few different buckets. The first, response planning. Preparation should happen long before an incident. A good response plan outlines roles, responsibilities, and step-by-step actions. It's like a fire drill. When the alarm sounds, no one should be asking, "What do we do now?"

After that, there's communications. As you can imagine during an incident, clear communication is everything. Your team, leadership, customers, regulators, and sometimes even the public need accurate, timely updates.

Next is analysis. Once a threat is detected, you need to quickly determine its scope, impact, and root cause.

Then there's mitigation. This is where you take action to contain the threat and stop it from spreading. So that might mean isolating systems, blocking malicious traffic, or disabling compromised accounts.

And last is improvement. After the smoke clears, don't just pat yourself on the back and move on. Take some time to figure out what worked and what didn't, and update your response plan, because every incident is an opportunity to make your cybersecurity posture even stronger.

Of course, speed matters, but so does staying levelheaded. I found that the organizations that recover best are the ones that practice their response regularly, through tabletop exercises and other simulations. So make sure to incorporate those in your ongoing security awareness plan. That way, when a real incident hits, you're better prepared. You can think about the Respond function as your playbook for turning "We've been breached" into "We've got this."`,

  "Recovery from incidents": `We've detected the threat, we've responded with a clear plan, and now the crisis has been contained, but it's not over. There's still work to do. Here's where the recover function of NIST CSF 2.0 comes into play because it's all about restoring normal operations, repairing the damage, and learning valuable lessons so you can come back better than before.

The recover function is often overlooked because it happens after the initial excitement of when an incident dies down. But don't underestimate it, it's just as important as to detection and response. This stage is about more than fixing systems. It's about restoring trust both inside and outside your organization. Your employees, customers, regulators, and stakeholders all want to know the same thing, "Are we safe now?" And recovery is your chance to demonstrate resilience and show that you've got things under control.

NIST CSF 2.0 highlights several critical actions for effective recovery. It starts with recovery planning. Don't wait for disaster to strike before you figure out how to get back online. Your recovery plan should outline how to restore systems, data, and services in order of priority. This ensures you focus on the most critical business functions first and go from there.

After that, is improvement, because I bet each incident teaches you something new about your tech ecosystem. So after recovery, you must review what worked well and what needs improvement. Update your playbooks, policies, and sometimes even the tech you use based on those lessons I hope you learned. This is the key in turning a painful experience into a stepping stone for future resilience.

And of course, communications. How you communicate after an incident can make or break your reputation. Be transparent, timely, and accurate when sharing information with customers, employees, and regulators. A vague or misleading message can damage trust far more than the incident itself.

The ultimate goal of recovery is resilience. And this doesn't just protect technology, it protects your brand, your revenue, and the confidence of everyone who depends on you. The recover function is the bridge between surviving an incident and thriving after one. By planning ahead, learning from each event, and rebuilding with resilience in mind, you ensure your organization doesn't just get back to normal, it actually gets better.`,

  "Customizing for your organization": `Now comes the billion dollar question. How do you take this framework and actually make it work for your organization? Valid question. Because there's no one size fits all solution in cybersecurity. Your organization has its own risks, business processes, cultures, resource, strengths, and challenges. Think of the CSF, like a universal recipe for cybersecurity. It's going to give you the ingredients and steps, but it doesn't know if you're cooking for a small startup or a global enterprise.

Tailoring ensures you focus on what matters most to your business while avoiding wasted time and effort on areas that won't deliver value. So here are a few tips.

First things first, understand your unique risks. Before you start mapping out controls, take a hard look at your risk landscape. What are the systems and data that matter most? Where are your vulnerabilities? What regulations and industry standards apply to you? This stage is about asking relevant questions and getting honest answers. The goal isn't to boil the ocean, but to pinpoint the areas where a cyber incident would cause the most damage to your organization so you know where to focus.

After that, map CSF outcomes to business processes. Once you understand your risks, align the CSFs function and categories with your business processes. For instance, if you run an e-commerce platform, protect outcome might map to payment processing systems while detect outcomes focused on monitoring fraud and unusual customer behavior. When the CSF is integrated in to day-to-day operations, cyber stops being something IT does and becomes part of how the business runs.

Then you need to prioritize and plan. Listen, you don't have to tackle everything at once. Use the CSF to prioritize improvements based on what will reduce the most risk or deliver the biggest value. Create a roadmap that includes quick wins for immediate impact and longer term initiatives for sustainable change. When done right, tailoring the CSF turns cyber from a standalone program into a strategic business enabler.

By tailoring and integrating the NIST CSF 2.0, you create a framework that fits your organization and evolves with it over time.`,

  "Measuring success and sustaining efforts": `Cybersecurity can sometimes be a little underappreciated. When nothing bad happens, it's easy for leadership to question the investment made into the cyber program. Let me share a few things I've learned to measure success and communicate value in a way that resonates with both technical teams and non-technical stakeholders.

I'll make it plain for you. Without measurement, you're just guessing. Metrics turn effort into evidence. They give you the data you need to demonstrate progress, justify resources, and make smarter decisions.

But here's the catch, not all metrics are created equal. Bad metrics are like counting how many emails your team sent last week. Sure, it's a number, but it doesn't say anything meaningful about reducing risk or protecting the business. Good metrics on the other hand, are outcome-focused, like the average time to detect and respond to threats, reduction in high-risk vulnerabilities over time, or even the percentage of critical business processes covered by incident response plans.

These types of metrics connect directly to the organization's goals, and show how cybersecurity impacts the bigger picture. Now, metrics are only powerful if you can explain them to the right audience. The CFO doesn't want to hear about port scans or endpoint logs. They care about financial impact, business continuity, and risk reduction.

NIST CSF 2.0 makes this easier by providing clear outcomes for each function. You can use these as benchmarks to track progress and maturity over time, because this isn't about compliance, but showing that your cybersecurity program is evolving alongside the business. Cybersecurity is never done, but with the NIST CSF 2.0 as your guide, you'll always have a clear path forward.`,

  "Cybersecurity is a continuous journey": `Finally, you made it to the end of the NIST CSF 2.0 journey. But here's the thing, cybersecurity isn't a one and done project, It's a continuous effort of learning, improving and adapting as threats and your business evolve.

If you're ready to keep sharpening your skills and staying connected to the latest trends and voices in the field, I invite you to listen to the "Women in Security and Privacy" podcast. It's full of conversations with some of my favorite practitioners and experts who share insights, experiences, and strategies for thriving in the ever-changing worlds of cybersecurity and privacy.

And if you'd like to go even deeper into the fundamentals, check out my book, "Learning Cybersecurity Fundamentals: A Practical Guide to Essential Cybersecurity Concepts." It breaks down the complex concepts into clear, approachable lessons, helping you build a strong foundation for your career or your organization.

Thank you for joining me on this journey. Now, take what you've learned, put it into action, and lead with confidence. The future of cybersecurity depends on it.`
};
