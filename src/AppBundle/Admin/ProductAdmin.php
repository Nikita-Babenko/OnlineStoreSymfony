<?php
/**
 * Created by PhpStorm.
 * User: 1
 * Date: 04.08.2017
 * Time: 20:40
 */
namespace AppBundle\Admin;

use Sonata\AdminBundle\Admin\AbstractAdmin;
use Sonata\AdminBundle\Datagrid\ListMapper;
use Sonata\AdminBundle\Datagrid\DatagridMapper;
use Sonata\AdminBundle\Form\FormMapper;

class ProductAdmin extends AbstractAdmin
{
    protected function configureFormFields(FormMapper $formMapper)
    {
        $formMapper
            ->add('name', 'text')
            ->add('price')
            ->add('photo')
           ->add('sku')
            ->add('category')
            ->add('isNew')
            ->add('discount');

    }

    protected function configureDatagridFilters(DatagridMapper $datagridMapper)
    {
        $datagridMapper
            ->add('name')
            ->add('price')
            ->add('photo')
            ->add('sku')
            ->add('category')
            ->add('isNew')
            ->add('discount');

    }

    protected function configureListFields(ListMapper $listMapper)
    {
        $listMapper
            ->addIdentifier('name')
            ->add('price')
            ->add('sku')
            ->add('category')
            ->add('isNew')
            ->add('discount');
             }
}