import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface FoodsProps {
  id: number,
  name: string,
  description: string,
  price: string,
  available: boolean,
  image: string
}

export function Dashboard(props: FoodsProps) {
  const [foods, setFoods] = useState<FoodsProps[]>([])
  const [editingFood, setEditingFood] = useState<FoodsProps>({} as FoodsProps)
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)

  useEffect(() => {

    async function fetchData() {
      const response = await api.get('/foods');

      setFoods(response.data);
    }

    fetchData()
  }, [])

  async function handleAddFood() {
    try {
      const response = await api.post('/foods', {
        ...foods,
        available: true
      })
      setFoods([...foods, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  async function handleUpdateFood() {
    try {const foodUpdated = await api.put(
      `/foods/${editingFood.id}`,
      { ...editingFood, ...foods },
    );

    const foodsUpdated = foods.map(f =>
      f.id !== foodUpdated.data.id ? f : foodUpdated.data,
    );

    setFoods(foodsUpdated);
    } catch(err){
      console.log(err)
    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!modalOpen)
  }

  function toggleEditModal(){
    setEditModalOpen(!editModalOpen)
  }

  function handleEditFood(food: FoodsProps) {
    setEditingFood(food)
    setEditModalOpen(true)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer> 
    </>
  )
}