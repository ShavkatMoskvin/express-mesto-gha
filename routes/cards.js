const router = require('express').Router();
const {
  getCards,
  createCard,
  removeCard,
  setLike,
  removeLike,
} = require('../controllers/cards');

router.get('/cards', getCards);
router.post('/cards', createCard);
router.delete('/cards/:cardId', removeCard);
router.put('/cards/:cardId/likes', setLike);
router.delete('/cards/:cardId/likes', removeLike);

module.exports = router;
