// 예시 Express.js API 핸들러

const express = require('express')
const router = express.Router()
const advices = [] // 임시 데이터 저장소

// GET 모든 어드바이스 가져오기
router.get('/advices', (req, res) => {
  res.json(advices)
})

// POST 새로운 어드바이스 추가하기
router.post('/advices', (req, res) => {
  advices.push(req.body)
  res.status(201).send()
})

// PUT 어드바이스 수정하기
router.put('/advices/:id', (req, res) => {
  const index = advices.findIndex((advice) => advice.id === req.params.id)
  if (index !== -1) {
    advices[index] = req.body
    res.send()
  } else {
    res.status(404).send()
  }
})

// DELETE 어드바이스 삭제하기
router.delete('/advices/:id', (req, res) => {
  const index = advices.findIndex((advice) => advice.id === req.params.id)
  if (index !== -1) {
    advices.splice(index, 1)
    res.send()
  } else {
    res.status(404).send()
  }
})

module.exports = router
