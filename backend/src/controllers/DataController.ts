import { Request, Response } from 'express';
import { CatalogModel } from '../models/CatalogModel';
import { ServiceModel } from '../models/ServiceModel';

export const getServices = async (req: Request, res: Response) => {
    const services = await ServiceModel.getAll();
    res.json(services);
};

export const getBrands = async (req: Request, res: Response) => {
    const brands = await CatalogModel.getBrands();
    res.json(brands);
};

export const getModels = async (req: Request, res: Response) => {
    const brandId = parseInt(req.params.brandId);
    const models = await CatalogModel.getModelsByBrand(brandId);
    res.json(models);
};