const agg = [
  {
    $match: {
      product: new isObjectIdOrHexString('67025a6f61a95180ae60a0ee'),
    },
  },
  {
    $group: {
      _id: null,
      averageRating: {
        $avg: '$rating',
      },
      numOfReviews: {
        $sum: 1,
      },
    },
  },
];
