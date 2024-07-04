import figlet from 'figlet'
import { yellow } from 'colors'

export const Banner = (bannerName: string) => {
  console.log(
    yellow(
      figlet.textSync(bannerName, {
        font: 'Graffiti',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 80,
        whitespaceBreak: true,
      }),
    ),
  )
  console.log('\n')
}
