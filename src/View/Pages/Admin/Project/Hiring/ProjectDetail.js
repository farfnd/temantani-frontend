import { LeftCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Card, Button, Badge, Modal } from 'react-bootstrap';
import config from '../../../../../config';
import Cookies from 'js-cookie';
import { Spin, message } from 'antd';
import Datatable from '../../../../Components/Datatable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [land, setLand] = useState(null);
  const [availableWorkers, setAvailableWorkers] = useState([]);
  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingWorker, setLoadingWorker] = useState(true);
  const [sentWorkOffers, setSentWorkOffers] = useState([]);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [dateOptions] = useState({ year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    fetchProject();
    fetchAvailableWorkers();
    fetchSentWorkOffers();
  }, []);

  const { confirm } = Modal;

  // Create table headers consisting of 4 columns.
  const headers = [
    {
      prop: "name",
      title: "Nama",
      isFilterable: true,
      isSortable: true,
      cell: (row) => (
        <div>
          <img
            src={row.profilePictureUrl ? `${config.api.workerService}/images/${row.profilePictureUrl}` : "https://placehold.co/50x50"}
            alt="Placeholder"
            style={{ width: '50px', height: '50px', marginRight: '10px' }}
          />
          {row.name}
        </div>
      )
    },
    {
      prop: "email",
      title: "Email"
    },
    {
      prop: "skills",
      title: "Keahlian",
      cell: (row) => (
        <>
          {row.skills.length > 0 ? (
            row.skills.map((skill, index) => skill.tag).join(', ')
          ) : (
            '-'
          )}
        </>
      )
    },
    {
      prop: "button",
      title: "Aksi",
      cell: (row) => (
        <div>
          <Button type="primary" size="small" onClick={() => showWorkerDetail(row)} className='me-2'>
            <FontAwesomeIcon icon={faEye} />
          </Button>
          {!isOfferSent(row.id) ? (
            <Button
              onClick={() => sendWorkOffer(row.id)}
              loading={loadingOffer}
              disabled={loadingOffer}
            >
              Send Work Offer
            </Button>
          ) : (
            <>
              {['PENDING', 'ACCEPTED', 'REJECTED'].includes(getWorkOfferStatus(row.id)) && (
                <>
                  {getWorkOfferStatus(row.id) === 'PENDING' ? (
                    <Button className='button-sm' onClick={() => cancelWorkOffer(row.id)} variant='danger'>Cancel Work Offer</Button>
                  ) : (
                    <Badge bg={getWorkOfferStatus(row.id) === 'ACCEPTED' ? 'success' : 'danger'}>
                      {getWorkOfferStatus(row.id)}
                    </Badge>
                  )}
                </>
              )}

            </>
          )}
        </div>
      )
    }
  ];

  const showWorkerDetail = async (row) => {
    console.log(row);
    setSelectedWorker(row);
    try {
      const response = await fetch(`${config.api.userService}/users/${row.id}`, {
        method: 'GET',
        headers: {
          Authorization: "Bearer " + Cookies.get('token'),
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      setModalData(data);
    } catch (error) {
      console.error(error);
      message.error('Gagal memuat data pekerja');
    }
    showModal();
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleCloseModal = () => {
    setModalData(null);
    setOpen(false);
  };

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
        if (projectData.initiatedAt) {
          projectData.initiatedAtReadable = new Date(projectData.initiatedAt).toLocaleDateString('id-ID', dateOptions);
        }
        if (projectData.estimatedFinished) {
          projectData.estimatedFinishedReadable = new Date(projectData.estimatedFinished).toLocaleDateString('id-ID', dateOptions);
        }
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
      const response = await fetch(`${config.api.workerService}/admin/workers?filter[workAvailability]=AVAILABLE&include=skills`, {
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

  const getWorkOfferStatus = (workerId) => {
    const offer = sentWorkOffers.find((offer) => offer.workerId === workerId);
    return offer ? offer.status : '';
  };
  const sendWorkOffer = async (workerId) => {
    setLoadingOffer(true);
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
        setLoadingOffer(false);
        fetchSentWorkOffers();
        message.success('Tawaran kerja berhasil dikirim');
      } else {
        const responseBody = await response.json();
        message.error(`Gagal send tawaran kerja: ${responseBody}`);
      }
    } catch (error) {
      console.error(error);
      message.error('Gagal send tawaran kerja: ' + error);
    }
  };

  const cancelWorkOffer = (workerId) => {
    confirm({
      title: 'Apakah Anda yakin akan membatalkan tawaran kerja?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Ya',
      cancelText: 'Tidak',
      onOk: async () => {
        try {
          const offer = sentWorkOffers.find((offer) => offer.workerId === workerId);
          if (!offer) {
            message.error('Tawaran kerja tidak ditemukan');
            return;
          }
          const offerId = offer.id;

          const response = await fetch(`${config.api.workerService}/admin/work-offers/${offerId}`, {
            method: 'DELETE',
            headers: {
              Authorization: "Bearer " + Cookies.get('token'),
              'Content-Type': 'application/json'
            }
          });

          if (response.ok) {
            message.success('Tawaran kerja berhasil dibatalkan');
            fetchSentWorkOffers(); // Refresh the sent tawaran kerjas list
          } else {
            const responseBody = await response.json();
            message.error(`Gagal membatalkan tawaran kerja: ${responseBody}`);
          }
        } catch (error) {
          console.error(error);
          message.error('Gagal membatalkan tawaran kerja: ' + error);
        }
      }
    });
  };

  return (
    <>
      <Card>
        <Link to="/admin/projects/hiring" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          <LeftCircleOutlined style={{ marginRight: '5px' }} />
          <span>Kembali ke Daftar Proyek</span>
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
                      <strong>Masa Proyek:</strong> {`${project.initiatedAtReadable ?? 'N/A'} - ${project.estimatedFinishedReadable ?? 'N/A'}`}<br />
                      <strong>Kebutuhan Pekerja:</strong> {project.workerNeeds}<br />
                      <strong>Deskripsi:</strong> {project.description}<br />
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
              <strong>Pekerja yang Tersedia:</strong>
              <Datatable data={availableWorkers} headers={headers} />
            </>
          )}
        </Card.Footer>
      </Card>
      <Modal
        show={open}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Informasi Pekerja</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {
            modalData ? (
              <>
                <p>
                  <strong>Nama:</strong> {modalData?.name}<br />
                  <strong>Alamat:</strong> {`${modalData?.street}, ${modalData?.city}, ${modalData?.postalCode}`}<br />
                  <strong>Telepon:</strong> {modalData?.phoneNumber}<br />
                  <strong>Email:</strong> {modalData?.email}
                </p>
                <p>
                  <strong>Keterampilan:</strong><br />{selectedWorker?.skills?.map((skill) => skill.tag).join(', ')}
                </p>
              </>
            ) : (
              <Spin />
            )
          }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Tutup
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProjectDetail;