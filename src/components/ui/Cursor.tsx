import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export function Cursor() {
    const cursorRef = useRef<HTMLDivElement>(null)
    const followerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const cursor = cursorRef.current
        const follower = followerRef.current

        if (!cursor || !follower) return

        let mouseX = 0
        let mouseY = 0
        let cursorX = 0
        let cursorY = 0
        let followerX = 0
        let followerY = 0

        const onMouseMove = (e: MouseEvent) => {
            mouseX = e.clientX
            mouseY = e.clientY
        }

        const onHoverStart = () => cursor.classList.add('hover')
        const onHoverEnd = () => cursor.classList.remove('hover')

        window.addEventListener('mousemove', onMouseMove)

        // Add hover listeners to interactive elements
        const addHoverListeners = () => {
            const interactives = document.querySelectorAll('a, button, .member-node, .orbit-particle')
            interactives.forEach(el => {
                el.addEventListener('mouseenter', onHoverStart)
                el.addEventListener('mouseleave', onHoverEnd)
            })
        }

        // Initial listener attachment
        addHoverListeners()

        // Observer for new elements (like members generated later)
        const observer = new MutationObserver(addHoverListeners)
        observer.observe(document.body, { childList: true, subtree: true })

        const animate = () => {
            cursorX += (mouseX - cursorX) * 0.15
            cursorY += (mouseY - cursorY) * 0.15
            followerX += (mouseX - followerX) * 0.08
            followerY += (mouseY - followerY) * 0.08

            gsap.set(cursor, { x: cursorX, y: cursorY })
            gsap.set(follower, { x: followerX, y: followerY })

            requestAnimationFrame(animate)
        }

        const animationId = requestAnimationFrame(animate)

        return () => {
            window.removeEventListener('mousemove', onMouseMove)
            cancelAnimationFrame(animationId)
            observer.disconnect()
            const interactives = document.querySelectorAll('a, button, .member-node, .orbit-particle')
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', onHoverStart)
                el.removeEventListener('mouseleave', onHoverEnd)
            })
        }
    }, [])

    return (
        <>
            <div ref={cursorRef} className="cursor" />
            <div ref={followerRef} className="cursor-follower" />
        </>
    )
}
