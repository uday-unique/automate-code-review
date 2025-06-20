import { cn } from "@/lib/utils";

export function H3(props: React.HTMLProps<HTMLHeadingElement>){
    return <h3
    {...props}
    className={cn("text-xl font-bold tracking-tight", props.className)}
    />
}