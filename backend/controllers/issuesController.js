const createIssue = (req, res) => {
  const newIssue = {
    id: Date.now(),
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    location: req.body.location,
    isAnonymous: req.body.isAnonymous === 'true',
    photoUrl:`/Civic-track-Just-Coders/uploads/${req.file.filename}`,
    status: 'Reported',
    createdAt: new Date()
  };
  issues.push(newIssue);
  res.status(201).json(newIssue);
};