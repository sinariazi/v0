import Image from 'next/image'
import { notFound } from 'next/navigation'

const blogPosts = {
  'the-true-cost-of-disengaged-employees': {
    title: 'The True Cost of Disengaged Employees',
    content: `
      <p>Employee disengagement is a silent productivity killer that's costing companies billions of dollars annually. According to a Gallup study, disengaged employees cost the U.S. economy up to $550 billion per year in lost productivity.</p>
      
      <p>Here are some key statistics:</p>
      <ul>
        <li>Only 15% of employees worldwide are engaged in their jobs (Gallup)</li>
        <li>Disengaged employees are 37% more likely to take sick days (Workplace Research Foundation)</li>
        <li>Companies with engaged employees outperform those without by up to 202% (Dale Carnegie)</li>
      </ul>
      
      <p>The costs of disengagement manifest in various ways:</p>
      <ol>
        <li><strong>Decreased Productivity:</strong> Disengaged employees are less productive, directly impacting your bottom line.</li>
        <li><strong>Higher Turnover:</strong> Disengaged employees are more likely to leave, increasing recruitment and training costs.</li>
        <li><strong>Lower Customer Satisfaction:</strong> Disengaged employees provide poorer customer service, potentially leading to lost business.</li>
        <li><strong>Increased Absenteeism:</strong> Disengaged employees take more sick days, disrupting workflows and increasing costs.</li>
      </ol>
      
      <p>Investing in employee engagement isn't just a feel-good initiative—it's a strategic business decision that can significantly impact your company's financial performance. By using tools like Mood Whisper, you can track engagement levels in real-time and take proactive steps to improve workplace satisfaction and productivity.</p>
    `,
    date: '2023-06-15',
    image: '/blog/disengaged-employees.jpg',
  },
  'boosting-productivity-through-engagement': {
    title: 'Boosting Productivity Through Engagement',
    content: `
      <p>Employee engagement is not just a buzzword—it's a critical factor in driving productivity and profitability. Engaged employees are more committed, perform better, and contribute more to their organizations.</p>
      
      <p>Here's how engagement boosts productivity:</p>
      <ol>
        <li><strong>Increased Discretionary Effort:</strong> Engaged employees go above and beyond their job descriptions, putting in extra effort to achieve company goals.</li>
        <li><strong>Better Focus and Quality:</strong> Engaged employees are more focused on their work, resulting in higher quality outputs and fewer errors.</li>
        <li><strong>Innovation and Creativity:</strong> When employees are engaged, they're more likely to contribute ideas and solutions, driving innovation within the company.</li>
        <li><strong>Improved Collaboration:</strong> Engaged employees work better in teams, enhancing overall organizational productivity.</li>
      </ol>
      
      <p>The numbers speak for themselves:</p>
      <ul>
        <li>Highly engaged business units achieve a 21% greater profitability (Gallup)</li>
        <li>Engaged employees are 87% less likely to leave their organizations (Corporate Leadership Council)</li>
        <li>Companies with engaged employees see 233% greater customer loyalty (Aberdeen Group)</li>
      </ul>
      
      <p>By using Mood Whisper's real-time engagement tracking and analytics, you can identify areas for improvement and implement targeted strategies to boost engagement. This data-driven approach allows you to make informed decisions that directly impact your company's productivity and bottom line.</p>
    `,
    date: '2023-06-22',
    image: '/blog/productivity-engagement.jpg',
  },
  'creating-a-culture-of-engagement': {
    title: 'Creating a Culture of Engagement',
    content: `
      <p>Building a culture of engagement is crucial for long-term business success. It's not about perks or one-off initiatives, but about creating an environment where employees feel valued, heard, and motivated.</p>
      
      <p>Key elements of an engaging culture include:</p>
      <ol>
        <li><strong>Clear Communication:</strong> Ensure employees understand the company's vision and their role in achieving it.</li>
        <li><strong>Empowerment:</strong> Give employees the autonomy to make decisions and take ownership of their work.</li>
        <li><strong>Recognition:</strong> Regularly acknowledge and reward good performance and contributions.</li>
        <li><strong>Growth Opportunities:</strong> Provide pathways for skill development and career advancement.</li>
        <li><strong>Work-Life Balance:</strong> Respect employees' time and promote a healthy work-life balance.</li>
      </ol>
      
      <p>The benefits of an engaging culture are significant:</p>
      <ul>
        <li>Companies with strong cultures saw a 4x increase in revenue growth (Forbes)</li>
        <li>72% of highly engaged employees understand how to meet customer needs (Quantum Workplace)</li>
        <li>Employees who feel their voice is heard are 4.6 times more likely to feel empowered to perform their best work (Salesforce)</li>
      </ul>
      
      <p>Mood Whisper can help you build and maintain this culture of engagement. By providing real-time insights into employee sentiment and engagement levels, you can quickly identify and address issues, celebrate successes, and continuously improve your workplace culture. Remember, creating an engaging culture is an ongoing process, not a destination—and with the right tools and commitment, it's a goal within every organization's reach.</p>
    `,
    date: '2023-06-29',
    image: '/blog/culture-engagement.jpg',
  },
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug]

  if (!post) {
    notFound()
  }

  return (
    <div className="py-12">
      <Image
        src={post.image}
        alt={post.title}
        width={1200}
        height={600}
        className="w-full h-[300px] object-cover mb-8 rounded-lg"
      />
      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
      <p className="text-muted-foreground mb-8">Published on {post.date}</p>
      <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
    </div>
  )
}

