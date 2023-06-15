const Job = require('../models/Job')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors/index')

const getAllJobs = async (req, res) => {

    const jobs = await Job.find({ createdBy: req.user.userId }).sort('createdAt')

    res.status(StatusCodes.OK).json({ msg: 'jobs fetched', count: jobs.length, jobs: jobs })
}

const createJob = async (req, res) => {
    console.log(req.body)
    console.log(req.user)
    const job = await Job.create({ ...req.body, createdBy: req.user.userId })

    res.status(StatusCodes.CREATED).json({ msg: 'jobs created successfully ', job: job })
}

const getJob = async (req, res) => {
    // userId is not necessary here but it is used to make sure that the user is the one who created the job, so just by having the job id, anyone can't access the job
    // req object destructuring
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findOne({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'job fetched successfully!', job: job })
}

const updateJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId }, body: { company, position } } = req;

    if (company === '' || position === '') {
        throw new BadRequestError('Please provide company and position')
    }

    const job = await Job.findOneAndUpdate({ _id: jobId, createdBy: userId }, req.body, { new: true, runValidators: true })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'jobs updated successfully', job: job })
}

const deleteJob = async (req, res) => {
    const { user: { userId }, params: { id: jobId } } = req;

    const job = await Job.findOneAndDelete({ _id: jobId, createdBy: userId })
    if (!job) {
        throw new NotFoundError(`No job with id ${jobId}`)
    }
    res.status(StatusCodes.OK).json({ msg: 'following job deleted ', job: job })
}

module.exports = { getAllJobs, createJob, getJob, updateJob, deleteJob }