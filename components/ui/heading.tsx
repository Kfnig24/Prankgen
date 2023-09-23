interface HeadingProps {
    title: string,
    description: string
}

export const Heading: React.FC<HeadingProps> = ({ title, description }) => (
    <div className="px-2 md:px-4">
        <h1 className="text-2xl font-bold opacity-90">
            {title}
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground px-2">
            {description}
        </p>
    </div>
)