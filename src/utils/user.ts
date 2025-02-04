import { imgUrl } from "@/config/domain"

export const getDefaultAvatar = (gender: number) => {
  const genderMap = {
    unknow: 0,
    male: 1,
    female: 2
  }
  let randomNumber
  if (gender === genderMap.male) {
    randomNumber = Math.floor(Math.random() * 3) + 1;
  } else if (gender === genderMap.female) {
    randomNumber = Math.floor(Math.random() * 2) + 4;
  } else {
    randomNumber = Math.floor(Math.random() * 5) + 1;
  }
  return `${imgUrl}/blog/avatar/avatar${randomNumber}.png`
}

export const getDefaultUserName = () => {
  let randomNumber: number | string = Math.floor(Math.random() * 100000);
    randomNumber = String(randomNumber).padStart(5, '0');
  return `笨鸟${randomNumber}`
}