const Sauce = require('../models/sauces');

const fs = require('fs');
// const { json } = require('stream/consumers'); //

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: [],
    });
    sauce.save()
    .then(() => res.status(201).json({ message: 'La sauce est enregistrée !'}))
    .catch(error => res.status(400).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : { ...req.body };
    Sauce.findOneAndUpdate({ _id : req.params.id }, 
        { ...sauceObject, _id : req.params.id })
        .then(() => res.status(200).json({ message: 'La sauce a été modifiée !'}))
        .catch(error => res.status(400).json({ error }));
}

exports.getAllsauces = (req, res, next) => {
    Sauce.find({ _id: req.params.id })
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(404).json({ error }));
};

exports.getOnesauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'La sauce a été supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

exports.evalSauce = (req, res, next) => {

    const like = req.body.like;
    const userId = req.body.userId;
    const sauceId = req.params.id;

    switch (like) {
        case 1:
            Sauce.findOneAndUpdate(
                { _id : sauceId },
                { $push: { usersLiked: userId }, $inc: { likes: +1 }})
                .then(() => res.status(200).json({ message: 'La sauce a bien été créditée !'}))
                .catch(error => res.status(400).json({ error }));
            break;

        case -1:
            Sauce.findOneAndUpdate(
                { _id : sauceId },
                { $push: { usersDisliked: userId }, $inc: { dislikes: +1 }})
                .then(() => res.status(200).json({ message: 'La sauce a bien été discréditée !'}))
                .catch(error => res.status(400).json({ error }));
            break;

        case 0:
            Sauce.findOne(
                { _id : sauceId })
                .then((sauce) => {
                    if (sauce.usersLiked.includes(userId)) {
                        Sauce.findOneAndUpdate(
                            { _id : sauceId },
                            { $pull: { usersLiked: userId }, $inc: { likes: -1}})
                            .then(() => res.status(200).json({ message: 'Le crédit de la sauce a bien été annulé !'}))
                            .catch(error => res.status(400).json({ error }));

                    }
                    else if (sauce.usersDisliked.includes(userId)) {
                        Sauce.findOneAndUpdate(
                            { _id : sauceId },
                            { $pull: { usersDisliked: userId }, $inc: { dislikes: -1}})
                            .then(() => res.status(200).json({ message: 'Le discrédit de la sauce a bien été annulé !'}))
                            .catch(error => res.status(400).json({ error }));
                    }
                    next;
                })
    }
};