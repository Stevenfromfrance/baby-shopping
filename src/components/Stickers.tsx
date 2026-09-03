/** Soft nursery stickers — colors follow the site palette. */

type StickerProps = {
  className?: string
  title?: string
}

export function StickerMoon({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--accent-soft)" opacity="0.55" />
      <path
        d="M38.5 14.5c-9.2 1.4-16 9.4-16 18.9 0 10.5 8.5 19 19 19 3.2 0 6.2-.8 8.8-2.2-3.2 4.4-8.4 7.3-14.3 7.3-9.7 0-17.5-7.8-17.5-17.5 0-8.4 5.9-15.4 13.8-17.1.7-.1 1.3-.2 2-.2 1.4 0 2.8.2 4.2.8Z"
        fill="var(--sky-deep)"
        opacity="0.88"
      />
      <path
        d="M46 18.5l1.1 2.6 2.7.4-2.1 1.9.6 2.7L46 24.7l-2.3 1.4.6-2.7-2.1-1.9 2.7-.4L46 18.5Z"
        fill="var(--blush)"
      />
    </svg>
  )
}

export function StickerHeart({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--blush)" opacity="0.28" />
      <path
        d="M32 46.5c-.6 0-1.1-.2-1.5-.6C25.2 40.2 20 35.4 20 29.8c0-4.1 3.1-7.3 7.2-7.3 2.1 0 4.1.9 5.5 2.5 1.4-1.6 3.4-2.5 5.5-2.5 4.1 0 7.3 3.2 7.3 7.3 0 5.6-5.2 10.4-10.5 16.1-.4.4-.9.6-1.5.6Z"
        fill="var(--blush)"
      />
      <path
        d="M27.5 26.2c1.4 0 2.7.6 3.6 1.6.3.3.8.3 1.1 0 .9-1 2.2-1.6 3.6-1.6"
        stroke="#fff"
        strokeWidth="1.6"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

export function StickerStar({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--accent-soft)" opacity="0.4" />
      <path
        d="M32 14.5l3.4 10.2H46l-8.4 6.2 3.2 10.1L32 35.2l-8.8 5.8 3.2-10.1-8.4-6.2h10.6L32 14.5Z"
        fill="var(--sky-deep)"
        opacity="0.9"
      />
      <circle cx="46" cy="18" r="2.2" fill="var(--blush)" />
      <circle cx="18" cy="42" r="1.6" fill="var(--sage)" opacity="0.85" />
    </svg>
  )
}

export function StickerCloud({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--mist)" opacity="0.9" />
      <path
        d="M22.5 40.5h21c3.6 0 6.5-2.9 6.5-6.5 0-3.3-2.5-6-5.7-6.4-.6-4.4-4.4-7.6-8.8-7.6-3.2 0-6 1.7-7.6 4.2-1-.5-2.1-.8-3.3-.8-3.9 0-7 3.1-7 7 0 .4 0 .8.1 1.1-2.4.7-4.2 2.9-4.2 5.5 0 3.2 2.6 5.5 5.8 5.5h3.2Z"
        fill="#fff"
        stroke="var(--line)"
        strokeWidth="1.2"
      />
      <circle cx="28" cy="24" r="1.5" fill="var(--sky-deep)" opacity="0.45" />
      <circle cx="40" cy="22" r="1.1" fill="var(--blush)" opacity="0.8" />
    </svg>
  )
}

export function StickerOnesie({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--accent-soft)" opacity="0.5" />
      <path
        d="M24.5 20.5c0-2.4 2.2-4.3 5-4.3h5c2.8 0 5 1.9 5 4.3v1.2c2.4.6 4.2 2.3 5.1 4.5l2.6 6.3c.4 1-.2 2.1-1.3 2.4l-2.4.7v8.6c0 2.4-2 4.3-4.5 4.3h-9c-2.5 0-4.5-1.9-4.5-4.3v-8.6l-2.4-.7c-1.1-.3-1.7-1.4-1.3-2.4l2.6-6.3c.9-2.2 2.7-3.9 5.1-4.5v-1.2Z"
        fill="#fff"
        stroke="var(--sky-deep)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="28.5" cy="34" r="1.4" fill="var(--blush)" />
      <circle cx="35.5" cy="34" r="1.4" fill="var(--blush)" />
      <path
        d="M29.5 38.5c.7.7 1.6 1.1 2.5 1.1s1.8-.4 2.5-1.1"
        stroke="var(--sage)"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function StickerBooties({ className }: StickerProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden
    >
      <circle cx="32" cy="32" r="28" fill="var(--blush)" opacity="0.22" />
      <path
        d="M18.5 28.5h9.5c1.4 0 2.5 1.1 2.5 2.5v2.2c2.8.4 5 2.7 5 5.5 0 1.2-.4 2.2-1 3.1H20c-2.5 0-4.5-2-4.5-4.5v-5.3c0-1.9 1.6-3.5 3-3.5Z"
        fill="var(--sky-deep)"
        opacity="0.85"
      />
      <path
        d="M36.5 28.5H46c1.4 0 3 1.6 3 3.5v5.3c0 2.5-2 4.5-4.5 4.5H34c-.6-.9-1-1.9-1-3.1 0-2.8 2.2-5.1 5-5.5V31c0-1.4 1.1-2.5 2.5-2.5Z"
        fill="var(--sage)"
        opacity="0.9"
      />
      <path
        d="M20 31.5h7.5M39 31.5H46"
        stroke="#fff"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
    </svg>
  )
}

type FloatProps = {
  variant?: 'section' | 'list' | 'messages' | 'footer'
}

export function StickerField({ variant = 'section' }: FloatProps) {
  if (variant === 'list') {
    return (
      <div className="sticker-field sticker-field-list" aria-hidden>
        <StickerOnesie className="sticker sticker-a" />
        <StickerStar className="sticker sticker-b" />
        <StickerBooties className="sticker sticker-c" />
      </div>
    )
  }

  if (variant === 'messages') {
    return (
      <div className="sticker-field sticker-field-messages" aria-hidden>
        <StickerHeart className="sticker sticker-d" />
        <StickerCloud className="sticker sticker-e" />
      </div>
    )
  }

  if (variant === 'footer') {
    return (
      <div className="sticker-field sticker-field-footer" aria-hidden>
        <StickerMoon className="sticker sticker-f" />
        <StickerHeart className="sticker sticker-g" />
        <StickerStar className="sticker sticker-h" />
      </div>
    )
  }

  return (
    <div className="sticker-field sticker-field-section" aria-hidden>
      <StickerCloud className="sticker sticker-i" />
      <StickerMoon className="sticker sticker-j" />
      <StickerStar className="sticker sticker-k" />
    </div>
  )
}

export function StickerRow() {
  return (
    <div className="sticker-row" aria-hidden>
      <StickerMoon className="sticker sticker-row-item" />
      <StickerOnesie className="sticker sticker-row-item" />
      <StickerHeart className="sticker sticker-row-item" />
      <StickerCloud className="sticker sticker-row-item" />
      <StickerStar className="sticker sticker-row-item" />
      <StickerBooties className="sticker sticker-row-item" />
    </div>
  )
}
