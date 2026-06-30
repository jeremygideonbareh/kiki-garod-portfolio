export interface Film {
  id: string
  title: string
  year: string
  type: string
  category: string
  synopsis: string
  stills: string[]
  poster: string
  duration: string
  awards: string[]
}

export interface Award {
  id: string
  title: string
  festival: string
  year: string
  film: string
  icon?: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  image: string
}
