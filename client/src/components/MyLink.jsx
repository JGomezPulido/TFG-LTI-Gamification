import { Link as UILink } from "@radix-ui/themes"
import { Link as RouterLink} from "react-router-dom"

export default function Link({to, children, ...radixProps}){
    return (
        <UILink asChild {...radixProps}>
            <RouterLink to={to}>
                {children}
            </RouterLink>
        </UILink>
    )
}