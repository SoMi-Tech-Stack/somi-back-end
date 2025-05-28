import { PromptTemplate } from '../prompt.types';

export const listeningActivityTemplate: PromptTemplate = {
  template: `Create a music listening activity for {yearGroup} that explores the theme of "{theme}" with a {energyLevel} energy level.

You MUST select a piece of classical or folk music that strongly connects to the theme "{theme}". 
Consider these thematic aspects:
- Musical characteristics that relate to {theme} (e.g., tempo, dynamics, mood)
- Historical or cultural connections to {theme}
- Programmatic or storytelling elements that relate to {theme}
- Visual or imaginative associations with {theme}

Return a JSON object with this EXACT structure:
{
  "piece": {
    "title": "Full title of the piece",
    "composer": "Full name of composer",
    "youtubeSearchQuery": "Full title of the piece + composer, suitable for YouTube search",
    "details": {
      "instruments": [
        "List of instruments used in the piece"
      ],
      "yearComposed": "Year or period of composition",
      "about": "Brief composer/piece background focusing on {theme} connection",
      "sheetMusicUrl": "URL to sheet music (if available on IMSLP or similar)",
      "wikipediaUrl": "URL to Wikipedia article about the piece"
    }
  },
  "reason": "Clear explanation of why this piece fits {theme}",
  "questions": [
    "3-5 discussion questions that connect the music to {theme}"
  ],
  "teacherTip": "Practical guidance for theme-based exploration"
}

Key Requirements:
- The piece MUST have a strong, clear connection to {theme}
- All content should be appropriate for {yearGroup} students
- Questions should encourage musical thinking about {theme}
- Activities should help students understand {theme} through music
- Focus on how the music represents or connects to {theme}
- The result (especially video links, descriptions, and questions) MUST be safe for children: 
  - No profanity, harassment, violence, or sexual content
  - No references to adult themes or unsafe links

Example Themes:
- Space: Use pieces that evoke celestial bodies or space exploration
- Animals: Choose music that depicts or was inspired by specific creatures
- Weather: Select pieces that represent different weather phenomena
- Emotions: Pick music that clearly expresses particular feelings
- Nature: Use pieces inspired by landscapes or natural elements`,
  variables: {
    yearGroup: 'The year group (e.g., Year 4)',
    theme: 'The theme or topic to explore through music',
    energyLevel: 'The overall energy level (e.g., Calm, Reflective, Energetic)',
  },
  examples: [
    {
      input: {
        yearGroup: 'Year 4',
        theme: 'Space',
      },
      output: JSON.stringify(
        {
          piece: {
            title: 'Jupiter, the Bringer of Jollity from The Planets',
            composer: 'Gustav Holst',
            youtubeSearchQuery:
              'Jupiter, the Bringer of Jollity from The Planets Gustav Holst',
            details: {
              instruments: [
                'Violin',
                'Cello',
                'Flute',
                'Trumpet',
                'Piano',
                'Percussion',
              ],
              yearComposed: '1914-1916',
              about:
                "Part of Holst's Planets Suite, inspired by Jupiter's massive size and powerful presence in our solar system",
              sheetMusicUrl:
                'https://imslp.org/wiki/The_Planets,_Op.32_(Holst,_Gustav)',
              wikipediaUrl: 'https://en.wikipedia.org/wiki/The_Planets#Jupiter',
            },
          },
          reason:
            "This piece perfectly captures the grandeur and excitement of space exploration. The majestic themes represent Jupiter's status as the largest planet, while the playful sections suggest the joy of discovery.",
          questions: [
            'How does the music make Jupiter feel big and powerful?',
            'What instruments help create the feeling of being in space?',
            "How does the composer make the music sound happy and exciting like Jupiter's name suggests?",
          ],
          teacherTip:
            "Have students move like planets orbiting the sun during the main theme. Use dynamics to show Jupiter's size by having them make big movements for loud sections and small movements for quiet parts.",
        },
        null,
        2,
      ),
    },
  ],
  constraints: [
    'Choose music with clear thematic connections',
    'Ensure all content directly relates to the theme',
    'Use age-appropriate musical vocabulary',
    'Make theme connections explicit in all aspects',
    'Return valid JSON matching the specified structure',
  ],
  format: 'JSON',
};
