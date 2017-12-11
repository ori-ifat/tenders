const req = require.context('common/style/icons/', false)

const SUBJ_FOOD = 58
const SUBJ_BUILD = 86
const SUBJ_CONSTRUCTION = 2
const SUBJ_CLEAN = 42
const SUBJ_TRAVEL = 26
const SUBJ_ACCOUNTING = 88
const SUBJ_WASTE = 55
const SUBJ_ELECTRICITY = 40

export function getSrc(id) {
  let ret = ''
  switch(id) {
  case SUBJ_FOOD:
    ret = req('./Food.svg')
    break
  case SUBJ_BUILD:
    ret = req('./build.svg')
    break
  case SUBJ_CONSTRUCTION:
    ret = req('./constraction.svg')
    break
  case SUBJ_CLEAN:
    ret = req('./cleening.svg')
    break
  case SUBJ_TRAVEL:
    ret = req('./Bus.svg')
    break
  case SUBJ_ACCOUNTING:
    ret = req('./Accounting.svg')
    break
  case SUBJ_WASTE:
    ret = req('./Wast.svg')
    break
  case SUBJ_ELECTRICITY:
    ret = req('./Electricity.svg')
    break
  }

  return ret
}
