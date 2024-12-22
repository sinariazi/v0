import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(date)
}

const blogPosts = [
  {
    slug: 'the-true-cost-of-disengaged-employees',
    title: 'The True Cost of Disengaged Employees',
    excerpt: 'Discover how employee disengagement is costing companies billions annually and what you can do about it.',
    date: '2023-06-15',
    image: '/blog/disengaged-employees.jpg',
  },
  {
    slug: 'boosting-productivity-through-engagement',
    title: 'Boosting Productivity Through Engagement',
    excerpt: 'Learn how engaged employees can significantly increase your company\'s productivity and bottom line.',
    date: '2023-06-22',
    image: '/blog/productivity-engagement.jpg',
  },
  {
    slug: 'creating-a-culture-of-engagement',
    title: 'Creating a Culture of Engagement',
    excerpt: 'Explore strategies for fostering a workplace culture that naturally encourages high employee engagement.',
    date: '2023-06-29',
    image: '/blog/culture-engagement.jpg',
  },
]

export default function BlogPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Mood Whisper Blog</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="flex flex-col">
            <Image
              src={post.image}
              alt={post.title}
              width={400}
              height={200}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <CardHeader>
              <CardTitle>
                <Link href={`/blog/${post.slug}`} className="hover:underline">
                  {post.title}
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-muted-foreground mb-4">{post.excerpt}</p>
              <p className="text-sm text-muted-foreground">
                Published on {formatDate(post.date)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

