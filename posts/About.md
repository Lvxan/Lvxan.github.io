---
layout: home
---
<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'
import emailIcon from './assets/email-icon.svg?raw'
import catIcon from './assets/noto-v1--cat-face.svg?raw'
import dogIcon from './assets/noto-v1--dog-face.svg?raw'

const members = [
  {
    avatar: './assets/avatar_C.JPG',
    name: 'Lux',
    title: 'Mcomp Infosec',
    org: 'NUS Soc',
    orgLink: 'https://www.comp.nus.edu.sg/',
    desc: 'Front-end Developer | Cybersecurity',
    links: [
      {
        icon: 'github',
        link: 'https://github.com/Lvxan',
        ariaLabel:'' },
      {
        icon: { svg: emailIcon },
        link: 'mailto:shooting_sleep@outlook.com',
        ariaLabel: 'shooting_sleep@outlook.com'
      },
      {
        icon: { svg: catIcon },
        ariaLabel: 'catIcon'
      },
    ]
  },
    {
    avatar: './assets/avatar_D.JPG',
    name: 'CK',
    title: 'PhD Student',
    org: 'BUAA CST',
    orgLink: 'https://cst.buaa.edu.cn/',
    desc: 'Cloud Security | Cryptography',
    links: [
      {
        icon: 'github',
        link: 'https://github.com/TheBestIDE', 
      },
      {
        icon: { svg: emailIcon },
        link: 'mailto:jin_785515@outlook.com',
        ariaLabel: 'e-mail link'
      },
      {
        icon: { svg: dogIcon },
        ariaLabel: 'dogIcon'
      },
    ]
  },
]
</script>

<VPTeamPage>
  <VPTeamMembers :members />
</VPTeamPage>