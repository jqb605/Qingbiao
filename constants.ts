
import { Project } from './types';

// [可修改] 这里是默认的初始数据。如果你不想从后台手动添加，可以直接修改这里的代码。
// [中文说明] 你可以在这里修改 INITIAL_PROJECTS 数组来改变网站首次加载时显示的默认作品。
// [Modifiable] Default initial data. You can edit this code directly if you prefer code over the admin panel.
export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Container',
    category: 'Experimental Theatre',
    year: '2025',
    description: 'Container follows two characters, designated #1 and #2, who repeatedly awaken inside an ambiguous, sealed space and attempt to find a way out. As cycles of searching and failure accumulate, their interpersonal dynamics shift: they negotiate, compete, cling, and test one another.\nOver successive iterations they begin to question whether the enclosing “container” is an external trap or a projection of their own internal limits.\n\nThis work has been presented in dozens of performances across diverse contexts — including theatre, live house, art space, and bar — and has been selected for several Chinese theatre festivals, including the Prism Mini Theatre Festival and the Tianjin Youth Theatre Festival.',
    coverImage: 'https://i.postimg.cc/25SqVB1L/default_(9).jpg',
    galleryImages: [
      'https://i.postimg.cc/mrpPM291/default_(7).jpg',
      'https://i.postimg.cc/xdpXHTmk/default_(8).jpg',
      'https://i.postimg.cc/Pq5LP8CC/default_(11).jpg',
      'https://i.postimg.cc/26qVxRdH/default.jpg',
      'https://i.postimg.cc/xd1kcbcW/default_(13).jpg',
      'https://i.postimg.cc/rpwdKtKB/default_(14).jpg',
      'https://i.postimg.cc/mrpPM29m/default_(3).jpg',
      'https://i.postimg.cc/cJkvY43T/default_(5).jpg',
      'https://i.postimg.cc/yN8JkSD1/default_(12).jpg',
    ],
    videoUrls: [
      'https://vimeo.com/1140451752?fl=ip&fe=ec',
      'https://vimeo.com/1140490716?fl=ip&fe=ec',
      'https://vimeo.com/1140451636?fl=ip&fe=ec',
      'https://vimeo.com/1140490350?fl=ip&fe=ec'
    ],
    castAndCrew: 'Directed by: Qingbiao Jia\nCast: Xinyi Du, Kangqian Hu, Sha Liao\nDuration: 60 mins\nRoles: Director/ Playwright/ Technical Developer/ Composer & Sound Designer',
  },
  {
    id: '2',
    title: 'WHAT SONGS DOES EMPORER LOVE?',
    category: 'One Person Show',
    year: '2025',
    description: 'What Songs Does the Emperor Love? is a darkly humorous solo performance about the absurd pursuit of recognition and the loss of self. The story follows Li Shengming, a talented young musician who abandons his musical gift to cultivate peonies—because the Emperor has decreed that government positions will be granted not by virtue or intellect, but by one’s ability to grow the finest flower.\n\nDriven by ambition, debt, and delusion, Li invests everything into his single pot of peonies, believing it to be his path to power. But when the time comes, he learns that the Emperor’s preference has changed once again—from flowers to music. His years of devotion collapse into irony and ruin, leaving him with only one haunting question: “What songs does the Emperor love?”\n\nThe piece satirizes blind conformity and social obsession with trends, using one man’s madness as a mirror of collective anxiety — about success, about recognition, about meaning.\n\nMultimedia design plays an active narrative role. Projection mapping transforms the stage into shifting psychological spaces: from imperial gardens to flower markets, from a dreamlike palace to the protagonist’s collapsing consciousness. The projection responds to lighting cues and performer movements, expanding emotional intensity rather than illustrating text.\n\nDynamic lighting design functions as a second performer — alternating between ritualistic red floods and fragile white spotlights, echoing Li’s fluctuating mental state.',
    coverImage: 'https://i.postimg.cc/vZzgYvZs/default_(16).jpg',
    galleryImages: [
      'https://i.postimg.cc/Hk2cYtsR/default_(17).jpg',
      'https://i.postimg.cc/N0jy5r5n/default_(15).jpg',
    ],
    videoUrls: ['https://vimeo.com/1140506926?fl=tl&fe=ec'],
    castAndCrew: 'Directed and Written by: Qingbiao Jia\nDuration: 30 mins\nRoles: Director/ Playwright/ Composer & Sound Designer',
  },
  {
    id: '3',
    title: 'You Are Special',
    category: 'Musical',
    year: '2024',
    description: 'What I aim for is philosophical simplicity. By filtering complex questions of identity and prejudice through a child’s perspective, the piece can disarm defenses and open a direct emotional channel. Children leave with a clear lesson about empathy and self-acceptance; adults are invited to reconsider the invisible labels they apply and inherit.\n\nFor me, theatre is a shared space for parallel reflection. In this production I wanted to remind audiences—both young and old—that real value does not come from others’ judgments, but from the courage to recognize and embrace your own singular essence.',
    coverImage: 'https://i.postimg.cc/rwJ0V9Fx/default_(24).jpg',
    galleryImages: [
      'https://i.postimg.cc/kgc6JyXF/default_(23).jpg',
      'https://i.postimg.cc/8zDfgYDZ/default_(25).jpg',
      'https://i.postimg.cc/L6jg7Sd5/default_(35).jpg',
    ],
    videoUrls: [
      'https://vimeo.com/1140506864?fl=tl&fe=ec',
      'https://vimeo.com/1140506799?fl=tl&fe=ec'
    ],
    castAndCrew: 'Directed and Written by: Qingbiao Jia\nDuration: 65 mins\nRoles: Director/Actor',
  },
    {
    id: '4',
    title: 'Logoverse',
    category: 'Drama',
    year: '2023',
    description: 'I treat folk stories not as fixed historical scenes to be reproduced, but as living expressive resources — symbolic and affective logics that can be abstracted, recomposed, and put into dialogue with contemporary media. In my practice the work’s atmosphere and staged conditions serve as a container for this ongoing re-interpretation rather than as an end in themselves.\n\nIn the macro-historical narrative of Logoverse, I employ multimedia and AI technologies to stage dialogues between a character (portrayed by myself) and a large-scale AI model. These exchanges both interpret and deepen the drama and produce a Brechtian alienation effect (Verfremdungseffekt), deliberately redirecting the audience’s attention back to the issues and phenomena under scrutiny.\n\nMultimedia functions as interpretation and extension: by shaping image, light and interaction I aim to make traditional vocabularies perceivable in new ways — preserving cultural reference while opening them to contemporary meanings. My goal is not to digitize tradition, but to stage a respectful conversation in which traditional aesthetics resonate within today’s media and public discourse.',
    coverImage: 'https://i.postimg.cc/Vk10Ph1S/default_(30).jpg',
    galleryImages: [
      'https://i.postimg.cc/BnsPfzsP/default_(32).jpg',
      'https://i.postimg.cc/Pr1vcHGx/default_(36).jpg',
      'https://i.postimg.cc/GhvTNR0n/default_(37).jpg',
      'https://i.postimg.cc/qv06HF0h/default_(31).jpg',
    ],
    videoUrls: [
      'https://vimeo.com/1140507273?fl=tl&fe=ec',
      'https://vimeo.com/1140506985?fl=tl&fe=ec',
      'https://vimeo.com/1140507141?fl=tl&fe=ec'
    ],
    castAndCrew: 'Directed and Written by: Qingbiao Jia\nDuration: 70 mins\nRoles: Director/Playwright/Actor',
  },
    {
    id: '5',
    title: 'In the Peach Blossom Land',
    category: 'Drama',
    year: '2023',
    description: 'I treat folk stories not as fixed historical scenes to be reproduced, but as living expressive resources — symbolic and affective logics that can be abstracted, recomposed, and put into dialogue with contemporary media. In my practice the work’s atmosphere and staged conditions serve as a container for this ongoing re-interpretation rather than as an end in themselves.\n\nIn the macro-historical narrative of Logoverse, I employ multimedia and AI technologies to stage dialogues between a character (portrayed by myself) and a large-scale AI model. These exchanges both interpret and deepen the drama and produce a Brechtian alienation effect (Verfremdungseffekt), deliberately redirecting the audience’s attention back to the issues and phenomena under scrutiny.\n\nMultimedia functions as interpretation and extension: by shaping image, light and interaction I aim to make traditional vocabularies perceivable in new ways — preserving cultural reference while opening them to contemporary meanings. My goal is not to digitize tradition, but to stage a respectful conversation in which traditional aesthetics resonate within today’s media and public discourse.',
    coverImage: 'https://i.postimg.cc/TYn5Sx8x/default_(39).jpg',
    galleryImages: [
      'https://i.postimg.cc/Jhs1f3yT/default_(42).jpg',
      'https://i.postimg.cc/7YSJckFR/default_(40).jpg',
      'https://i.postimg.cc/G3Wsq25f/default_(41).jpg',
      'https://i.postimg.cc/Pr1vcHGh/default_(38).jpg',
    ],
    videoUrls: [
      'https://vimeo.com/1140506620?fl=tl&fe=ec',
      'https://vimeo.com/1140506522?fl=tl&fe=ec'
    ],
    castAndCrew: 'Directed by: Qingbiao Jia\nDuration: 70 mins\nRoles: Director/Playwright',
  },
    {
    id: '6',
    title: 'King Lear',
    category: 'Rehersal',
    year: '2022',
    description: 'I have consistently pursued the excavation and application of ethnic-specific performance resources across my work. In rehearsal I integrate embodied techniques and stage vocabularies drawn from traditional Chinese opera—breath control, stylized gesture, codified posture and spatial phrasing—into contemporary theatrical practice. \n\nThis studio research piece fuses and reconfigures the narrative framework of Shakespeare’s King Lear with the performative vocabulary of Chinese opera. By translating the tragedy’s emotional threads into opera’s codified gestures, recitative-style speech, and stylized vocal timbres, the work investigates how power, kinship and madness are realized across different performance traditions. Employing a rhythmically driven physical language and live piano accompaniment, the actors explore character motivation through constrained improvisations that combine operatic embodiment with contemporary dramatic practice. The piece functions both as a re-reading of the canonical text and as a practice-led inquiry into how cross-traditional performance grammars can generate new textual forms.',
    coverImage: 'https://i.postimg.cc/t4ynGcy3/default_(28).jpg',
    galleryImages: [
      'https://i.postimg.cc/x1YNVZYy/default_(27).jpg',
      'https://i.postimg.cc/RZ9JxY9w/default_(29).jpg',
    ],
    videoUrls: [
      'https://vimeo.com/1140492683?fl=ip&fe=ec',
      'https://vimeo.com/1140511587?fl=tl&fe=ec'
      ],
  },
];

// [可修改] 管理员登录密码。为了演示方便，这里写死在前端。
// [中文说明] 修改下方的 'admin' 即可更改后台登录密码。
// 真实项目中应该在后端验证。
// [Modifiable] Admin password. Hardcoded for demo purposes.
export const ADMIN_PASSWORD = 'admin';