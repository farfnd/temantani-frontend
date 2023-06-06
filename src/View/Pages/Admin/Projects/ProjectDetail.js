import { LeftCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Table } from 'react-bootstrap';
import config from '../../../../config';
import Cookies from 'js-cookie';
import Holder from 'holderjs';
import { Spin, message } from 'antd';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [land, setLand] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [sentWorkOffers, setSentWorkOffers] = useState([]);

  useEffect(() => {
    fetchProject();
    fetchAvailableWorkers();
    fetchSentWorkOffers();
    Holder.run();
  }, []);

  const fetchProject = async () => {
    try {
      setLoadingProject(true);

      const response = await fetch(`${config.api.projectService}/projects/${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const projectData = await response.json();

      if (projectData) {
        setProject(projectData);
        const landResponse = await fetch(`${config.api.landService}/lands/${projectData.landId}`, {
          method: 'GET',
          headers: {
            Authorization: "Bearer " + Cookies.get('token'),
            'Content-Type': 'application/json'
          }
        });
        const landData = await landResponse.json();
        setLand(landData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingProject(false);
    }
  };

  const fetchAvailableWorkers = async () => {
    try {
      setLoadingWorker(true);
      const response = await fetch(`${config.api.workerService}/admin/workers?filter[workAvailability]=AVAILABLE`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setAvailableWorkers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingWorker(false);
    }
  };

  const fetchSentWorkOffers = async () => {
    try {
      const response = await fetch(`${config.api.workerService}/admin/work-offers?filter[projectId]=${id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setSentWorkOffers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const isOfferSent = (workerId) => {
    return sentWorkOffers.some((offer) => offer.workerId === workerId);
  };

  const sendWorkOffer = async (workerId) => {
    try {
      const requestBody = {
        projectId: id,
        workerId: workerId,
        status: 'PENDING'
      };

      const response = await fetch(`${config.api.workerService}/admin/work-offers`, {
        method: 'POST',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      if (response.ok) {
        message.success('Work offer sent!');
      } else {
        const responseBody = await response.json();
        message.error(`Failed to send work offer: ${responseBody}`);
      }
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <>
      <Card>
        <Link to="/admin/projects" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <LeftCircleOutlined style={{ marginRight: '5px' }} />
          <span>Back to Projects</span>
        </Link>
        <Card.Body>
          {loadingProject ? (
            <Spin />
          ) : (
            project && land && (
              <>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <img
                    src="https://placehold.co/600x400"
                    alt="Placeholder"
                    style={{ marginRight: '10px', maxWidth: '300px', maxHeight: '300px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <Card.Title>{land.street}, {land.city}</Card.Title>
                    <Card.Text>
                      <strong>Status:</strong> {project.status}<br />
                      <strong>Worker Needs:</strong> {project.workerNeeds}<br />
                      <strong>Description:</strong> {project.description}<br />
                    </Card.Text>
                  </div>
                </div>
              </>
            )
          )}
        </Card.Body>

        <Card.Footer>
          {loadingWorker ? (
            <Spin />
          ) : (
            <>
              <strong>Available Workers:</strong>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {availableWorkers.map((worker) => (
                    <tr key={worker.id}>
                      <td>
                        <img
                          src="https://placehold.co/50x50"
                          alt="Placeholder"
                          style={{ width: '50px', height: '50px', marginRight: '10px' }}
                        />
                        {worker.name}
                      </td>
                      <td>{worker.email}</td>
                      <td>
                        <Button onClick={() => sendWorkOffer(worker.id)} disabled={isOfferSent(worker.id)}>
                          {isOfferSent(worker.id) ? 'Work Offer Sent' : 'Send Work Offer'}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Footer>
      </Card>
    </>
  );
};

export default ProjectDetail;
