// 笔记标签常量：运行时数据在 AppData.noteTags 域（用户可增改删、拖拽排序），本文件提供默认值
import type { NoteTag } from '../types'

/** 新建笔记带该标签时自动进艾宾浩斯复习池（标签名牵动规则，故该标签 locked 不可改名删除） */
export const AUTO_REVIEW_TAG = '时政'

/** noteTags 域默认值：builtin=内置不可删（可改名）；locked=「时政」不可删不可改名 */
export const DEFAULT_NOTE_TAGS: NoteTag[] = [
  { name: '时政', builtin: true, locked: true },
  { name: '素材', builtin: true },
  { name: '心得', builtin: true },
  { name: '金句', builtin: true },
  { name: '其他', builtin: true },
]
